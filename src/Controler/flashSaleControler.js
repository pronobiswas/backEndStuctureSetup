const { ApiError } = require("../Utils/ApiError");
const { ApiResponse } = require("../Utils/ApiResponse.js");
const flashSaleModel = require("../Model/flashSale.Model");

// =========add flashSale products======
const addFlashSaleProductsControler = async (req, res) => {
  try {
    const { id } = req.params;
    const { productId, timeOffer } = req.body;

    // =========validation========
    if (!productId) {
      return res
        .status(400)
        .json(
          new ApiError(false, 400, null, "Flash Sale Creadiantial missing")
        );
    }
    // =====check isExist=======
    const isExist = await flashSaleModel
      .findOne({ productId: productId })
      .populate("productId");

    if (isExist) {
      return res
        .status(400)
        .json(
          new ApiError(false, 400, null, "Flash Sale product alredy exist")
        );
    }

    // =======save data on database======
    const flashSaleProduct = await new flashSaleModel({
      productId: productId,
    }).save();
    if (flashSaleProduct) {
      return res
        .status(200)
        .json(
          new ApiResponse(
            true,
            flashSaleProduct,
            200,
            null,
            "flashSale product save successfully"
          )
        );
    }
  } catch (error) {
    return res
      .status(500)
      .json(
        new ApiError(
          false,
          null,
          500,
          `addFlashSaleProductsControler Error:  ${error} !!`
        )
      );
  }
};

// ========get flash  Sale Products=======
const getFlashSaleProductsControler = async (req, res) => {
  try {
    // =======get data on database======
    const geflashSaleProduct = await flashSaleModel
      .find({})
      .populate("productId");
    if (geflashSaleProduct) {
      return res
        .status(200)
        .json(
          new ApiResponse(
            true,
            geflashSaleProduct,
            200,
            null,
            "flashSale product get successfully"
          )
        );
    } else {
      return res
        .status(501)
        .json(
          new ApiError(
            false,
            null,
            501,
            `geflashSaleProduct Error:  ${error} !!`
          )
        );
    }
  } catch (error) {
    return res
      .status(500)
      .json(
        new ApiError(
          false,
          null,
          500,
          `addFlashSaleProductsControler Error:  ${error} !!`
        )
      );
  }
};

// ========delete FlashProduct======

module.exports = {
  addFlashSaleProductsControler,
  getFlashSaleProductsControler,
};
