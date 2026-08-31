import { Router } from 'express';
import { StoryController } from '../controllers/storyController.js';

export const storyRouter = Router();

storyRouter.get('/', StoryController.getStories);
