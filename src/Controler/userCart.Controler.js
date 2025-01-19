const cartModel = require("../Model/cart.Model");
const { userModel } = require("../Model/user.model");
const { ApiError } = require("../Utils/ApiError");
const { ApiResponse } = require("../Utils/ApiResponse");
// =====addTo cart controler=====
const addToCartControler = async (req, res) => {
  try {
    const { product, quantity } = req.body;
    const { userID } = req.user.id;
    // =====validation=====
    if (!product) {
      return res
        .status(404)
        .json(new ApiError(false, null, 400, `cart credential missing !!`));
    }
    // ====find the product===
    const isExistProduct = await cartModel.findOne({ product: product });
    // ====if is exist product increment quantity===
    if (isExistProduct) {
      isExistProduct.quantity += 1;
      await isExistProduct.save();
      return res
        .status(201)
        .json(
          new ApiResponse(true, isExistProduct, 201, null, "againd add to cart")
        );
    }
    // ====now save the products===
    const saveproduct = await cartModel.create({
      product,
      quantity,
      user: req.user?.id,
    });

    // ====if cant save send an error response===
    if (!saveproduct) {
      return res
        .status(404)
        .json(new ApiError(false, null, 400, `Add to cart Failed !!`));
    }

    // ====push the cart item into user model==
    if (saveproduct) {
      const CartUser = await userModel.findById(req.user?.id);
      console.log(CartUser);
      CartUser.cartItem.push(saveproduct._id);
      await CartUser.save();
      // ====sent the success response===
      return res
        .status(200)
        .json(
          new ApiResponse(
            true,
            saveproduct,
            200,
            null,
            "add to cart   sucesfull"
          )
        );
    }
  } catch (error) {
    console.log("user cart controler Error");
    return res
      .status(501)
      .json(
        new ApiError(
          false,
          null,
          501,
          `addtocart Controller Error:  ${error} !!`
        )
      );
  }
};

// =====remove cart controler=====
const romoveCartControler = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user;
    console.log(userId.id);

    // ===delete form cart====
    const removeCartitem = await cartModel.findOneAndDelete({ _id: id });
    if (!removeCartitem) {
      return res
        .status(401)
        .json(new ApiError(false, null, 401, `Remove Cart Failed !!`));
    }
    // ====delete form user===
    const userCartItem = await userModel.updateOne(
      { _id: userId?.id },
      { $pull: { cartItem: id } }
    );

    return res
      .status(200)
      .json(
        new ApiResponse(
          true,
          "removeCartitem",
          200,
          null,
          "add to cart delete  sucesfull"
        )
      );
  } catch (error) {
    return res
      .status(501)
      .json(
        new ApiError(
          false,
          null,
          501,
          `Remove addtocart Controller Error:  ${error} !!`
        )
      );
  }
};

// =====Increment Cart quantity=====
const incrementCartControler = async (req, res) => {
  try {
    const { id } = req.params;
    const cartItem = await cartModel.findOne({ _id: id });
    console.log(cartItem);
    cartItem.quantity += 1;
    await cartItem.save();
    if (!cartItem) {
      return res
        .status(401)
        .json(
          new ApiError(false, null, 401, `Failed increment cartItem quantity!!`)
        );
    }
    return res
      .status(200)
      .json(new ApiResponse(true, cartItem, 200, null, "cart item increment"));
  } catch (error) {
    return res
      .status(501)
      .json(
        new ApiError(
          false,
          null,
          501,
          ` addtocart increment Controller Error:  ${error} !!`
        )
      );
  }
};

// =====decrement cart quantity===
const decrementCartControler = async (req, res) => {
  try {
    const { id } = req.params;
    const cartItem = await cartModel.findOne({ _id: id });
    if (cartItem.quantity > 1) {
      cartItem.quantity -= 1;
      await cartItem.save();
    }
    if (!cartItem) {
      return res
        .status(401)
        .json(
          new ApiError(false, null, 401, `Failed decrement cartItem quantity!!`)
        );
    }
    return res
      .status(200)
      .json(new ApiResponse(true, cartItem, 200, null, "cart item decrement"));
  } catch (error) {
    return res
      .status(501)
      .json(
        new ApiError(
          false,
          null,
          501,
          ` addtocart decrement Controller Error:  ${error} !!`
        )
      );
  }
};

// ===userCartItem===
const userCartItem = async (req, res) => {
  try {
    const user = req.user;
    // ====get all product by user====
    const allCartItem = await cartModel
      .find({ user: user.id })
      .populate(["product", "user"]);

    if (!allCartItem) {
      return res
        .status(404)
        .json(new ApiError(false, null, 404, `Cart Not Found !!`));
    }
    // =====get sub total or price===
    const subtotal = allCartItem?.reduce(
      (initialValue, item) => {
        const { quantity, product } = item;
        console.log(typeof(product?.price));

        initialValue.totalprice += parseFloat(
          parseInt(product?.price) * parseInt(quantity)
        );
        initialValue.quantity += quantity;
        return initialValue;
      },
      {
        quantity: 0,
        totalprice: 0,
      }
    );
    console.log(subtotal);
  } catch (error) {
    console.log(error);
    return res
      .status(501)
      .json(
        new ApiError(
          false,
          null,
          501,
          ` allCartItem Controller Error:  ${error} !!`
        )
      );
  }
};
module.exports = {
  addToCartControler,
  romoveCartControler,
  incrementCartControler,
  decrementCartControler,
  userCartItem,
};
