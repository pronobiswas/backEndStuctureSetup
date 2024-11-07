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
    let SecureLink = [];
    // =====distucture Images=====
    for(let imagePath of localfilepath){
      // =======upload Images=======
      const uploadResult = await cloudinary.uploader.upload(
        imagePath?.path ||
          "https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg",
        {}
      );
      
      // ========delete temp image files===========
      fs.unlinkSync(`${imagePath?.path}`, (err) => {
        if (err) {
          console.log("image unlinksyc error", err);
        }
      });
      SecureLink.push(uploadResult.secure_url)
    }
    return SecureLink;
    


  } catch (error) {
    console.log("From Cloudinary upoloader function errro: ", error);
  }
};

module.exports = { uploaadCloudinary };
