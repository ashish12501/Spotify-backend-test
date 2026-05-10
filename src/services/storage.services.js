import ImageKit from "@imagekit/nodejs";

const ImageKitClient = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});

async function uploadFile(file) {
  const result = await ImageKitClient.files.upload({
    file: file.toString("base64"),
    fileName: "music_" + Date.now() + ".mp3",
    folder: "/Spotify-backend/music",
  });

  return result;
}

export default uploadFile;
