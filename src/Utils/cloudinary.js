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
    for (let imagePath of localfilepath) {
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
      SecureLink.push(uploadResult.secure_url);
    }
    return SecureLink;
  } catch (error) {
    console.log("From Cloudinary upoloader function errro: ", error);
  }
};

const deleteCloudImage = async (imagePth) => {
  console.log(imagePth);
  
  try {
    for (singleImage of imagePth) {
      const allImageUrl = singleImage.split('/');
      console.log(allImageUrl);
      
      const cloudImagename =(allImageUrl[allImageUrl?.length -1].split('.')[0]);
      console.log(cloudImagename);
      
       await cloudinary.api
            .delete_resources(cloudImagename ||'dpkks1jq07ehurbjhm6u',
                { type: 'upload', resource_type: 'image' })
      
    }
    console.log(deleteItem);
    
  } catch (error) {
    console.log("this is from cloudnary delete image" , error);
  }
};

module.exports = { uploaadCloudinary ,deleteCloudImage };
