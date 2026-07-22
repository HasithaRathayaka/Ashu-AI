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
  return new Promise((resolve) => {
    const apiKey = process.env.CLOUDINARY_API_KEY;

    // Fallback if Cloudinary credentials are missing or placeholders
    if (!apiKey || apiKey.length < 12 || apiKey === 'OHG3aqKISZx' || apiKey.includes('your_cloudinary')) {
      console.warn('⚠️ Cloudinary credentials invalid or missing. Using Base64 Data URI fallback.');
      const base64 = buffer.toString('base64');
      return resolve(`data:image/png;base64,${base64}`);
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'auto'
      },
      (error, result) => {
        if (error) {
          console.warn('⚠️ Cloudinary Upload Error, using Base64 Data URI fallback:', error.message);
          const base64 = buffer.toString('base64');
          return resolve(`data:image/png;base64,${base64}`);
        }
        resolve(result.secure_url);
      }
    );

    uploadStream.end(buffer);
  });
};

export default cloudinary;
