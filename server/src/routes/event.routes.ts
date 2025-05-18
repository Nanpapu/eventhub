import { Router } from "express";
import eventController from "../controllers/event.controller";
import { authenticate, isOrganizer } from "../middlewares/auth.middleware";

const router = Router();

// Public routes
router.get("/", eventController.getEvents);
router.get("/:id", eventController.getEventById);

// Protected routes (cần đăng nhập)
router.use(authenticate);

// Routes cho người dùng đã đăng nhập
router.get("/user/events", eventController.getUserEvents);
router.get("/user/stats", eventController.getEventStats);

// Routes cho nhà tổ chức
router.post("/", isOrganizer, eventController.createEvent);
router.put("/:id", eventController.updateEvent); // Có kiểm tra quyền trong controller
router.delete("/:id", eventController.deleteEvent); // Có kiểm tra quyền trong controller
router.patch("/:id/publish", eventController.updateEventPublishStatus); // Có kiểm tra quyền trong controller

export default router;
