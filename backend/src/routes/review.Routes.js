// src/routes/review.routes.js
import { Router } from 'express';
import * as reviewCtrl from '../controllers/review.Controller.js';
import { createReviewValidation } from '../validators/review.Validator.js';

const router = Router();

router.post('/', createReviewValidation, reviewCtrl.createReview);
router.get('/', reviewCtrl.getReviews);
router.get('/masajistas/:id', reviewCtrl.getReviewsByMasajista);
router.put('/:id', reviewCtrl.updateReview);
router.delete('/:id', reviewCtrl.deleteReview);

export default router;