import musicModel from "../models/music.model.js";
import jwt from "jsonwebtoken";
import uploadFile from "../services/storage.services.js";

async function createMusic(req, res) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      message: "Unauthorised access",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "artist") {
      return res.status(403).json({
        message: "You don't have access to create music",
      });
    }

    const { title } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        message: "Music file is required",
      });
    }

    const result = await uploadFile(file.buffer);

    const music = await musicModel.create({
      uri: result.url,
      title,
      artist: decoded.id,
    });

    res.status(201).json({
      message: "Created successfully",
      music: {
        id: music._id,
        uri: music.uri,
        title: music.title,
        artist: music.artist,
      },
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
}

export default { createMusic };
