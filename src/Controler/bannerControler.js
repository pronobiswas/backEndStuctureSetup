const { ApiError } = require("../Utils/ApiError");
const { ApiResponse } = require("../Utils/ApiResponse.js");
const {
  uploaadCloudinary,
  deleteCloudImage,
} = require("../Utils/cloudinary.js");
const bannerModel = require("../Model/bannerModel.js");
// ======craete bannner Controler=========
const CreateBannerControl = async (req, res) => {
  try {
    const { name } = req.body;
    const { image } = req.files?.image;

    // ======validation=========
    if (!name) {
      return res
        .status(404)
        .json(new ApiError(false, null, 404, "Image not found"));
    }
    // ======uploadCloudnary==========
    const uploadUrl = await uploaadCloudinary(req.files?.image);

    // =======save to the database=======
    const saveBnnerImage = await new bannerModel({
      name: name,
      image: uploadUrl[0],
    }).save();
    // -----bannerImageRES----
    if (saveBnnerImage) {
      return res
        .status(200)
        .json(new ApiResponse(true, null, 200, saveBnnerImage));
    }
  } catch (error) {
    return res
      .status(400)
      .json(
        new ApiError(
          false,
          null,
          400,
          `CreateBannerControl Error:  ${error} !!`
        )
      );
  }
};
// ======get all banner Controler=========
const GetallBannerImageControler = async (req, res) => {
  try {
    // ======queryOndatabase======
    const allbannerImage = await bannerModel.find({});
    if (allbannerImage) {
      return res
        .status(200)
        .json(
          new ApiResponse(
            true,
            allbannerImage,
            200,
            null,
            "successfully get  allbannerImage"
          )
        );
    }
  } catch (error) {
    return res
      .status(400)
      .json(
        new ApiError(false, null, 400, `GetallBannerImage Error:  ${error} !!`)
      );
  }
};

// ======delete Banner image controler=========
const deleteBannerImageControler = async (req, res) => {
  try {
    const {id} = req.params;
    // ====find item ======
    const seacrhItem = await bannerModel.findById(id);
    if(!seacrhItem){
      return res
      .status(404)
      .json(
        new ApiError(
          false,
          null,
          404,
          `banner item not found`
        )
      );
    }
    // ====delete image from cloudinary====
    const deletedImage = await deleteCloudImage([seacrhItem?.image]);
    // ====delete data from database=======
    const deleteItem = await bannerModel.findOneAndDelete({_id:id});
    if(deleteItem){
      res.status(200).json(
        new ApiResponse(
          true,
          deleteItem,
          200,
          null,
          "delete successfully"
        )
      )
    }
    

    
  } catch (error) {
    return res
      .status(400)
      .json(
        new ApiError(
          false,
          null,
          400,
          `deleteBannerImageControler Error:  ${error} !!`
        )
      );
  }
};

// ========update benner Controler=======
const updateBannnerControler = async (req, res) => {
  try {
    // ====distructing data from request=======
    const { id } = req.params;
    const { image } = req.files?.image;
    console.log(req.files?.image);

    // ======validation=====
    // if (!image) {
    //   return res
    //     .status(404)
    //     .json(new ApiError(false, null, 404, "Image not found"));
    // }
    // ======Search item====
    const seacrhItem = await bannerModel.findById(id);

    // -----if search item notfound-----
    if (!seacrhItem) {
      return res
        .status(404)
        .json(new ApiError(false, null, 404, "Item not found"));
    }
    if (seacrhItem) {
      // ====delete image from cloudinary====
      const deletedImage = await deleteCloudImage([seacrhItem?.image]);
      // ===if delete seccessfully===
      if (deletedImage) {
        // =====upload new image on cloudnary=======
        const uploadUrl = await uploaadCloudinary(req.files?.image);
        // ====update banner===
        if(uploadUrl){
          const updateBanner = await bannerModel.findOneAndUpdate(
            {_id:id},
            {...req.body, image:uploadUrl[0]},
            {new:true}
          );
          if(updateBanner){
            return res
        .status(200)
        .json(
          new ApiResponse(
            true,
            updateBanner,
            200,
            null,
            "successfully update banner"
          )
        );
          }
        }
        
      } else {
        return res
          .status(404)
          .json(new ApiError(false, null, 404, "Image couls not deleted"));
      }
    }

    // ======throw global error======
  } catch (error) {
    return res
      .status(400)
      .json(
        new ApiError(
          false,
          null,
          400,
          `updateBannnerControler Error:  ${error} !!`
        )
      );
  }
};

// =======exports========
module.exports = {
  CreateBannerControl,
  GetallBannerImageControler,
  deleteBannerImageControler,
  updateBannnerControler,
};
