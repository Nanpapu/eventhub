import { Router } from "express";
import eventController from "../controllers/event.controller";
import { authenticate, isOrganizer } from "../middlewares/auth.middleware";
import { eventImageUpload } from "../config/cloudinary";

const router = Router();

// Public routes
router.get("/", eventController.getEvents);
router.get("/:id", eventController.getEventById);

// Protected routes (cần đăng nhập)
router.use(authenticate);

// Routes cho người dùng đã đăng nhập
router.get("/user/events", eventController.getUserEvents);
router.get("/user/stats", eventController.getEventStats);
router.get("/user/saved-events", eventController.getSavedEvents);

// Routes cho chức năng lưu sự kiện
router.post("/:id/save", eventController.saveEvent);
router.delete("/:id/save", eventController.unsaveEvent);
router.get("/:id/is-saved", eventController.isEventSaved);

// Route upload ảnh sự kiện
router.post(
  "/upload-image",
  isOrganizer,
  eventImageUpload.single("image"),
  eventController.uploadEventImage
);

// Routes cho nhà tổ chức
router.post("/", isOrganizer, eventController.createEvent);
router.put("/:id", isOrganizer, eventController.updateEvent);
router.delete("/:id", isOrganizer, eventController.deleteEvent);
router.patch(
  "/:id/publish",
  isOrganizer,
  eventController.updateEventPublishStatus
);
router.patch(
  "/:id/visibility",
  isOrganizer,
  eventController.toggleEventVisibility
);

// Route cho dashboard của tổ chức
router.get(
  "/organizer/dashboard-stats",
  isOrganizer,
  eventController.getOrganizerDashboardStats
);

export default router;
