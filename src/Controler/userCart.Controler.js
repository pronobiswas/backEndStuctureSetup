const cartModel = require('../Model/cart.Model')


const addToCartControler = async (req, res) => {
  try {
    console.log("user cart controler");
    console.log(req.user);
    
  } catch (error) {
    console.log("user cart controler Error");
  }
};

module.exports = {
    addToCartControler,
};
