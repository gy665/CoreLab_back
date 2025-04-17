import Course from '../models/course.model.js';
import cloudinary from '../utils/cloudinary.js';

export const getCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



//course avaiblity
export const getCourseAvailability = async (req, res) => {
    try {
      const { courseId, date } = req.params;
      
      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(404).json({ message: 'Course not found' });
      }
  
      const reservationCount = await Reservation.countDocuments({ 
        course: courseId, 
        sessionDate: new Date(date) 
      });
  
      const availableSpots = course.capacity - reservationCount;
  
      res.status(200).json({
        course: course.title,
        date,
        capacity: course.capacity,
        booked: reservationCount,
        available: availableSpots
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };




export const createCourse = async (req, res) => {
    try {
      const { title, coach, description, schedule, capacity, image } = req.body;
  
      let uploadedImage = '';
  
      if (image) {
        // Déjà une URL complète
        if (image.startsWith('http')) {
          uploadedImage = image;
        }
        // Public ID Cloudinary
        else if (!image.startsWith('data:image/')) {
          uploadedImage = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/${image}`;
        }
        // Base64
        else {
          const uploadedResponse = await cloudinary.uploader.upload(image, {
            folder: 'courses',
            resource_type: 'auto'
          });
          uploadedImage = uploadedResponse.secure_url;
        }
      }
  
      const course = await Course.create({
        title: title?.trim(),
        coach: coach?.trim(),
        description: description?.trim(),
        schedule: schedule?.trim(),
        capacity: Number(capacity),
        image: uploadedImage
      });
  
      res.status(201).json(course);
    } catch (error) {
      console.error('Error creating course:', error);
      res.status(500).json({
        message: 'Failed to create course',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  };




  export const updateCourse = async (req, res) => {
    try {
      const { id } = req.params;
      const { title, coach, description, schedule, capacity, image, ...otherFields } = req.body;
  
      // 1. Find existing course
      const existingCourse = await Course.findById(id);
      if (!existingCourse) {
        return res.status(404).json({ message: 'Course not found' });
      }
  
      // 2. Prepare update data (only updates provided fields)
      const updateData = { ...otherFields };
  
      if (title !== undefined) updateData.title = title.trim();
      if (coach !== undefined) updateData.coach = coach.trim();
      if (description !== undefined) updateData.description = description.trim();
      if (schedule !== undefined) updateData.schedule = schedule.trim();
      if (capacity !== undefined) updateData.capacity = Number(capacity);
  
      // 3. Handle image update (only if new image is provided)
      if (image !== undefined) {
        if (image === '') {
          // Case: Remove image
          updateData.image = '';
          if (existingCourse.image) {
            const publicId = existingCourse.image.split('/').slice(-2).join('/').split('.')[0];
            await cloudinary.uploader.destroy(publicId).catch(console.error);
          }
        } else if (image !== existingCourse.image) {
          if (image.startsWith('data:image/')) {
            // Case: New Base64 image (upload to Cloudinary)
            const uploadedResponse = await cloudinary.uploader.upload(image, {
              folder: 'courses',
              resource_type: 'auto'
            });
            updateData.image = uploadedResponse.secure_url;
  
            // Delete old image if it exists
            if (existingCourse.image) {
              const publicId = existingCourse.image.split('/').slice(-2).join('/').split('.')[0];
              await cloudinary.uploader.destroy(publicId).catch(console.error);
            }
          } else {
            // Case: Direct URL or Cloudinary ID
            updateData.image = image;
          }
        }
      }
  
      // 4. Update course (only modified fields)
      const updatedCourse = await Course.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true } // Return updated doc + validate
      );
  
      res.status(200).json(updatedCourse);
    } catch (error) {
      console.error('Error updating course:', error);
      res.status(500).json({
        message: 'Failed to update course',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  };


export const deleteCourse = async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Course deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
