const { ApiError } = require("../Utils/ApiError");
const { ApiResponse } = require("../Utils/ApiResponse.js");
const { uploaadCloudinary } = require("../Utils/cloudinary.js");
const productModel = require("../Model/product.Model.js");

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
    // ========check this product=======
    const isExistProduct = await productModel.find({ title: req.body.title });
    if (isExistProduct?.length) {
      return res
        .status(404)
        .json(
          new ApiError(
            false,
            null,
            404,
            `product ${isExistProduct.title} allredy exist !!`
          )
        );
    }

    // =======upload image========
    const imageInfo = await uploaadCloudinary(image);
    
    // ========save in mongodb=======
    const SaveProduct = await new productModel({
      ...req.body,
      image: [...imageInfo],
      
    }).save();
    console.log(SaveProduct);

    if (SaveProduct) {
      return res
        .status(200)
        .json(
          new ApiResponse(true, SaveProduct, 200, "Product save sucesfull")
        );
    }
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