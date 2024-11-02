const fs = require("fs");
const cloudinary = require("cloudinary").v2;
// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRECT,
});

const uploaadCloudinary = async (
  localfilepath = "public\\temp\\images.png"
) => {
  try {
   
    const uploadResult = await cloudinary.uploader.upload(
      localfilepath ||
        "https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg",
      {}
    );
    console.log(uploadResult);
    
    
    fs.unlinkSync(`${localfilepath}`, (err) => {
      if (err) {
        console.log("image unlinksyc error", err);
      }
    });
  } catch (error) {
    console.log("From Cloudinary upoloader function errro: ", error);
  }
};

module.exports = { uploaadCloudinary };
