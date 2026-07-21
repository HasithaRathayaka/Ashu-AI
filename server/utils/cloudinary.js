import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * Helper to upload image buffer directly to Cloudinary
 * @param {Buffer} buffer - Image file buffer
 * @param {string} folder - Destination folder on Cloudinary
 * @returns {Promise<string>} Secure URL of uploaded image
 */
export const uploadToCloudinaryBuffer = (buffer, folder = 'quick-ai-creations') => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'auto'
      },
      (error, result) => {
        if (error) {
          console.error('❌ Cloudinary Upload Error:', error);
          return reject(error);
        }
        resolve(result.secure_url);
      }
    );

    uploadStream.end(buffer);
  });
};

export default cloudinary;
