import express from "express";
import contactController from "../controllers/contact.controller";
import { validateContactEmail } from "../validations/contact.validation";

const router = express.Router();

/**
 * @route   POST /api/contact
 * @desc    Gửi email từ form liên hệ
 * @access  Public
 */
router.post("/", validateContactEmail, contactController.sendContactEmail);

export default router;
