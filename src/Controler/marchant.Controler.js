const { ApiResponse } = require("../Utils/ApiResponse.js");
const { ApiError } = require("../Utils/ApiError.js");
const marchantModel = require("../Model/marchant.Model.js");
const {userModel} = require('../Model/user.model.js')
const { EamilChecker, bdNumberChecker } = require("../Utils/Checker.js");

const createMarchantControler = async (req, res) => {
  try {
    const { Users, StoreName, TelePhone, EmailAddress } = req.body;
    // =====validation=====
    if (!EmailAddress || !EamilChecker(EmailAddress)) {
      return res
        .status(404)
        .json(
          new ApiError(false, null, 404, `EmailAddress missing or in valid!!`)
        );
    }
    if (!Users || !StoreName ||!TelePhone ) {
      return res
        .status(404)
        .json(
          new ApiError(
            false,
            null,
            404,
            `Marchant Creadential missing or in valid!!`
          )
        );
    }
    // if (!TelePhone || !bdNumberChecker(TelePhone)) {
    //   return res
    //     .status(404)
    //     .json(
    //       new ApiError(false, null, 404, `TelePhone missing or in valid!!`)
    //     );
    // }
    // ======check alredy check marchant=====
    const isAlreadyExistMarchant = await marchantModel.find({
      $or: [{ EmailAddress }, { TelePhone }],
    });
    if (isAlreadyExistMarchant?.length) {
      return res
        .status(404)
        .json(new ApiError(false, null, 404, `Marchant allredy Registred!!`));
    }
    // =====now save the marchant information into database=====
    const saveMarchant = await new marchantModel({
        Users, StoreName, TelePhone, EmailAddress
    }).save();
    // =====update userRole====
    if(saveMarchant){
        const updateUserRole = await userModel.findOne({_id:Users});
        updateUserRole.Role = "marchent";
        await updateUserRole.save();
    }
    // ======return response======
    return res
        .status(200)
        .json(
          new ApiResponse(
            true,
            saveMarchant,
            200,
            "Marchant Created sucesfully"
          )
        );
    
    // ====throwing Errror===
  } catch (error) {
    return res
      .status(501)
      .json(
        new ApiError(
          false,
          null,
          400,
          `createMarchantControler Error:  ${error} !!`
        )
      );
  }
};
module.exports = { createMarchantControler };
