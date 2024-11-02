const { ApiError } = require("../Utils/ApiError");
const { ApiResponse } = require("../Utils/ApiResponse.js");
const { uploaadCloudinary } = require("../Utils/cloudinary.js");

const postProductControler = async (req, res) => {
  try {
    // =========validation====
    const nonRequireItem = ["subcategory", "discountPrice", "rating", "review"];
    for (let key in req.body) {
      if (nonRequireItem.includes(key)) {
        continue;
      }
      if (!req.body[key]) {
        return res
          .status(404)
          .json(new ApiError(false, null, 404, `product ${key} Missing!!`));
      }
    }
    // ======image validation=====
    const image = req.files?.image;
    if (!image) {
      return res
        .status(404)
        .json(new ApiError(false, null, 404, `image not found !!`));
    }
    // =======upload image========
    const imageInfo = await uploaadCloudinary(image[0].path);
    console.log(image );
    console.log(imageInfo );
    

  } catch (error) {
    return res
      .status(501)
      .json(
        new ApiError(
          false,
          null,
          501,
          `postProductControler Error:  ${error} !!`
        )
      );
  }
};

module.exports = { postProductControler };
