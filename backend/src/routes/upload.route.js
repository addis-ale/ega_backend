import express from "express";
import cloudinary from "../lib/cloudinary.js";
import streamifier from "streamifier";
import upload from "../middleware/upload.js";

const uploadRoute = express.Router();

const streamUpload = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "products" },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

uploadRoute.post("/images", upload.array("images", 6), async (req, res) => {
  console.log(req.body);
  try {
    const files = req.files;
    if (!files || files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const uploadResults = await Promise.all(
      files.map((file) => streamUpload(file.buffer))
    );

    const imageUrls = uploadResults.map((img) => img.secure_url);
    return res.status(200).json({ urls: imageUrls });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Upload failed", error: err.message });
  }
});

export default uploadRoute;
