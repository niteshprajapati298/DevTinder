const cloudinary = require("cloudinary").v2;

// Check if env variables are defined
if (
  !process.env.CLOUDINARY_CLOUD_NAME ||
  !process.env.CLOUDINARY_API_KEY ||
  !process.env.CLOUDINARY_API_SECRET
) {
  console.error("❌ Cloudinary config missing in .env file");
  process.exit(1); // Stop the app immediately
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure:true
});
// const folderName = "DevTinder";

// // Step 1: List all resources inside the folder
// async function deleteDevTinderImages() {
//   try {
//     const result = await cloudinary.api.delete_resources_by_prefix(`${folderName}/`);
//     console.log("✅ Images deleted successfully:", result);

//     // Step 2: Optionally delete the folder (only if empty)
//     const folderDelete = await cloudinary.api.delete_folder(folderName);
//     console.log("🗂️ Folder deleted:", folderDelete);
//   } catch (error) {
//     console.error("❌ Error while deleting:", error);
//   }
// }

// deleteDevTinderImages();

module.exports = cloudinary;
