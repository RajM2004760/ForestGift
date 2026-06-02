import express from 'express';
import { getStories, createStory, deleteStory, updateStory } from '../controllers/storyController';

const router = express.Router();

router.get('/', getStories);
router.post('/', createStory);
router.delete('/:id', deleteStory);
router.patch('/:id', updateStory);

export default router;
