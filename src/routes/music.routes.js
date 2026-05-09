import express from "express";
import musicController from "../controllers/music.controller.js";
import multer from "multer";

const upload = multer({
  storage: multer.memoryStorage(),
});
const router = express.Router();

router.post("/create", upload.single("music"), musicController.createMusic);

export default router;
