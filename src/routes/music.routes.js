import express from "express";
import musicController from "../controllers/music.controller.js";
import multer from "multer";
import authMiddleware from "../middlewares/auth.middleware.js";
const upload = multer({
  storage: multer.memoryStorage(),
});
const router = express.Router();

router.post(
  "/create",
  authMiddleware.authArtist,
  upload.single("music"),
  musicController.createMusic,
);
router.post(
  "/create-album",
  authMiddleware.authArtist,
  musicController.createAlbum,
);
router.get("/all-musics", authMiddleware.isUser, musicController.getAllMusics);
router.get("/all-albums", authMiddleware.isUser, musicController.getAllAlbums);
router.get("/album/:id", authMiddleware.isUser, musicController.getAlbumById);

export default router;
