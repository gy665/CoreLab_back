import express from 'express';
import {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  getFutureCourse
} from '../controllers/course.controller.js';

const router = express.Router();

router.get('/', getCourses);
router.get('/future', getFutureCourse);
router.get('/:id', getCourse);

router.post('/', createCourse);
router.patch('/:id', updateCourse);
router.delete('/:id', deleteCourse);

export default router;
