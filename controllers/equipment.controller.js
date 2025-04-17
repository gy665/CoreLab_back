import Equipment from '../models/equipment.model.js';
import cloudinary from '../utils/cloudinary.js';


 export const getEquipments = async (req, res) => {
    try {
        const equipments = await Equipment.find({});
        res.status(200).json(equipments);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const getEquipment = async (req, res) => {
    try {
        const { id } = req.params;
        const equipment = await Equipment.findById(id);
        res.status(200).json(equipment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createEquipment = async (req, res) => {
    try {
      const { name, quantity, price, image } = req.body;
  
      let uploadedImage = null;
      
      if (image) {
        // Check if image is already a URL (from Cloudinary or other source)
        if (image.startsWith('http')) {
          uploadedImage = image;
        } 
        // Check if it's a Cloudinary public ID
        else if (!image.startsWith('data:image/')) {
          uploadedImage = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/${image}`;
        }
        // Otherwise, treat as Base64 and upload to Cloudinary
        else {
          const uploadResponse = await cloudinary.uploader.upload(image, {
            folder: 'equipment_images',
            resource_type: 'auto'
          });
          uploadedImage = uploadResponse.secure_url;
        }
      }
  
      const equipment = await Equipment.create({
        name: name.trim(),
        quantity: Number(quantity),
        price: Number(price),
        image: uploadedImage
      });
  
      res.status(201).json(equipment);
    } catch (error) {
      console.error('Error creating equipment:', error);
      res.status(500).json({ 
        message: 'Failed to create equipment',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  };

  export const updateEquipment = async (req, res) => {
    try {
      const { id } = req.params;
      const { name, quantity, price, image, ...otherFields } = req.body;
  
      // 1. Find existing equipment
      const existingEquipment = await Equipment.findById(id);
      if (!existingEquipment) {
        return res.status(404).json({ message: 'Equipment not found' });
      }
  
      // 2. Handle image update if new image is provided
      let imageUrl = existingEquipment.image; // Keep existing image by default
      
      if (image && image !== existingEquipment.image) {
        // Case 1: New Base64 image - upload to Cloudinary
        if (image.startsWith('data:image/')) {
          const uploadResponse = await cloudinary.uploader.upload(image, {
            folder: 'equipment_images',
            resource_type: 'auto'
          });
          imageUrl = uploadResponse.secure_url;
          
          // Optional: Delete old image from Cloudinary
          if (existingEquipment.image) {
            const publicId = existingEquipment.image.split('/').slice(-2).join('/').split('.')[0];
            await cloudinary.uploader.destroy(publicId);
          }
        }
        // Case 2: Direct URL or Cloudinary public ID
        else {
          imageUrl = image;
        }
      }
  
      // 3. Prepare update data
      const updateData = {
        name: name || existingEquipment.name,
        quantity: quantity || existingEquipment.quantity,
        price: price || existingEquipment.price,
        image: imageUrl,
        ...otherFields
      };
  
      // 4. Update equipment
      const updatedEquipment = await Equipment.findByIdAndUpdate(
        id,
        updateData,
        { new: true } // Return the updated document
      );
  
      res.status(200).json(updatedEquipment);
    } catch (error) {
      console.error('Update error:', error);
      res.status(500).json({ 
        message: 'Update failed',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  };



export const deleteEquipment = async (req, res) => {
    try {
        const { id } = req.params;
        const equipment = await Equipment.findByIdAndDelete(id);
        if (!equipment) {
            return res.status(404).json({ message: "equipment not found" });
        }
        res.status(200).json({ message: "equipment deleted with success" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



