// src/routes/workouts.ts
// Main Workouts Router mounting split routers - NOVAIX FITNESS

import express, { Router } from 'express';
import listingRouter from './workouts/listing';
import customRouter from './workouts/custom';
import activityRouter from './workouts/activity';
import favoritesRouter from './workouts/favorites';
import historyRouter from './workouts/history';

const router: Router = express.Router();

router.use('/', listingRouter);
router.use('/', customRouter);
router.use('/', activityRouter);
router.use('/', favoritesRouter);
router.use('/', historyRouter);

export = router;
