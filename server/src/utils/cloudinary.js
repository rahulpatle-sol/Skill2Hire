import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

export const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;
        // Upload to Cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
        });
        // Success! Ab local file delete kar do
        fs.unlinkSync(localFilePath);
        return response;
    } catch (error) {
        // Fail hua tab bhi local file delete karo taaki temp folder clean rahe
        fs.unlinkSync(localFilePath);
        return null;
    }
};