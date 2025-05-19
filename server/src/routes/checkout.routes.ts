import express from "express";
import { processDemoPayment } from "../controllers/checkout.controller";
import { authenticate } from "../middlewares/auth.middleware"; // Middleware xác thực

const router = express.Router();

/**
 * @route   POST /api/v1/checkout/process-payment
 * @desc    Process a demo payment for an event
 * @access  Private (requires authentication)
 */
router.post("/process-payment", authenticate, processDemoPayment);

export default router;
