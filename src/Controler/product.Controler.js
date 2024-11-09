const { ApiError } = require("../Utils/ApiError");
const { ApiResponse } = require("../Utils/ApiResponse.js");
const {
  uploaadCloudinary,
  deleteCloudImage,
} = require("../Utils/cloudinary.js");
const productModel = require("../Model/product.Model.js");
const NodeCache = require("node-cache");
const myCache = new NodeCache();

// =====create a product======
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

// =======get all product=======
const getAllProductControler = async (req, res) => {
  try {
    // =======trying get data from cache=====
    let value = myCache.get("allProduct");

    if (value === undefined) {
      // ===find data from database===
      const allproducts = await productModel
        .find({})
        .populate(["category", "subcategory", "owner"]);

      // ====set cache data====
      myCache.set("allProduct", JSON.stringify(allproducts));
      // ===return a response===
      return res
        .status(200)
        .json(
          new ApiResponse(
            true,
            allproducts,
            200,
            `getAllProductControler successfully !!`
          )
        );
    } else {
      return res
        .status(200)
        .json(
          new ApiResponse(
            true,
            JSON.parse(value),
            200,
            `getAllProductControler successfully !!`
          )
        );
    }

    // ======trow an Error===
  } catch (error) {
    return res
      .status(501)
      .json(
        new ApiError(
          false,
          null,
          501,
          `getAllProductControler Error:  ${error} !!`
        )
      );
  }
};

// ======update Products====
const updatePrductControler = async (req, res) => {
  try {
    const { id } = req.params;
    const image = req.files?.image;
    let updateProductOBJ = {};
    // =========find the object=====
    const productTobeUpdate = await productModel.findById(id);
    
    
    if (image) {
      // =====deleteImage From cloudnari======
      await deleteCloudImage(productTobeUpdate?.image);
      console.log(productTobeUpdate?.image);
      // =====upload new image in cloudinary======
      const imageUrl = await uploaadCloudinary(image);

      updateProductOBJ = { ...req.body, image: imageUrl };
    } else {
      updateProductOBJ = { ...req.body };
    }

    // =====updateANDreturn the product======
    const updatedProduct = await productModel.findOneAndUpdate(
      { _id: id },
      { ...updateProductOBJ },
      { new: true }
    );

    if (updatedProduct) {
      return res
        .status(200)
        .json(
          new ApiResponse(
            true,
            updatedProduct,
            200,
            `product update succfullly !!`
          )
        );
    } else {
      return res
        .status(501)
        .json(new ApiError(false, null, 501, `product update failed !!`));
    }

    // =====throw update product Error=====
  } catch (error) {
    return res
      .status(501)
      .json(
        new ApiError(
          false,
          null,
          501,
          `updatePrductControler Error:  ${error} !!`
        )
      );
  }
};
module.exports = {
  postProductControler,
  getAllProductControler,
  updatePrductControler,
};
