const { ApiError } = require("../Utils/ApiError");
const { ApiResponse } = require("../Utils/ApiResponse.js");
const { uploaadCloudinary } = require("../Utils/cloudinary.js");
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
        .json(new ApiResponse(true, allbannerImage, 200, null,"successfully get  allbannerImage"));
    }
  } catch (error) {
    return res
      .status(400)
      .json(
        new ApiError(false, null, 400, `GetallBannerImage Error:  ${error} !!`)
      );
  }
};

// =======exports========
module.exports = { CreateBannerControl, GetallBannerImageControler };
