import musicModel from "../models/music.model.js";
import jwt from "jsonwebtoken";
import uploadFile from "../services/storage.services.js";
import albumModel from "../models/album.model.js";

async function createMusic(req, res) {
  try {
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
      artist: req.user.id,
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

async function createAlbum(req, res) {
  try {
    const { title, musicIds } = req.body;
    const album = await albumModel.create({
      title,
      artist: req.user.id,
      musics: musicIds,
    });

    res.status(201).json({
      message: "Album created successfully!",
      album: {
        id: album._id,
        title: album.title,
        artist: album.artist,
        musics: album.musics,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
}

async function getAllMusics(req, res) {
  try {
    const musics = await musicModel
      .find()
      .limit(20)
      // .skip(0)
      .populate("artist", "username , email");
    res.status(200).json({
      message: "Musics retrieved successfully",
      musics: musics,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
}

async function getAllAlbums(req, res, next) {
  try {
    const albums = await albumModel
      .find()
      .limit(20)
      .select("title artist") //adding select so it ignores the musics field and only returns title and artist
      .populate("artist", "username, email");
    // .populate("musics", "title , uri");
    res.status(200).json({
      message: "fetch success",
      albums: albums,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "something went wrong",
    });
  }
}

async function getAlbumById(req, res) {
  try {
    const albumId = req.params.id;
    const album = await albumModel
      .findById(albumId)
      .populate("artist", "username, email")
      .populate("musics", "title , uri");
    res.status(200).json({
      message: "Album retrieved successfully",
      album: album,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "something went wrong",
    });
  }
}

export default {
  createMusic,
  createAlbum,
  getAllMusics,
  getAllAlbums,
  getAlbumById,
};
