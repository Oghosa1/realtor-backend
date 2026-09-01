import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';
import { env } from '../config/env.js';

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

export class CloudinaryService {
  /**
   * Uploads an image buffer to Cloudinary
   * @param {Buffer} buffer The file buffer
   * @returns {Promise<string>} The secure URL of the uploaded image
   */
  static uploadImage(buffer) {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'expertlisting/posts' },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            return reject(new Error('Failed to upload image.'));
          }
          resolve(result);
        }
      );
      streamifier.createReadStream(buffer).pipe(uploadStream);
    });
  }

  /**
   * Deletes an image from Cloudinary
   * @param {string} publicId The public ID of the image
   */
  static async deleteImage(publicId) {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.error(`Failed to delete Cloudinary asset ${publicId}:`, error);
    }
  }

  /**
   * Extracts the public ID from a Cloudinary secure URL
   */
  static extractPublicId(secureUrl) {
    // Example: https://res.cloudinary.com/demo/image/upload/v12345/expertlisting/posts/abcd.jpg
    const parts = secureUrl.split('/');
    const fileWithExtension = parts.pop();
    const folderPath = parts.slice(parts.indexOf('expertlisting')).join('/');
    const fileWithoutExtension = fileWithExtension.split('.')[0];
    return folderPath ? `${folderPath}/${fileWithoutExtension}` : fileWithoutExtension;
  }
}
