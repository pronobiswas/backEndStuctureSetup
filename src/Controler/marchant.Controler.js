const { ApiResponse } = require("../Utils/ApiResponse.js");
const { ApiError } = require("../Utils/ApiError.js");
const marchantModel = require("../Model/marchant.Model.js");
const { userModel } = require("../Model/user.model.js");
const { EamilChecker, bdNumberChecker } = require("../Utils/Checker.js");
// =======create marchant=====
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
    if (!Users || !StoreName || !TelePhone) {
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
      Users,
      StoreName,
      TelePhone,
      EmailAddress,
    }).save();
    // =====update userRole====
    if (saveMarchant) {
      const updateUserRole = await userModel.findOne({ _id: Users });
      updateUserRole.Role = "marchent";
      await updateUserRole.save();
    }
    // ======return response======
    return res
      .status(200)
      .json(
        new ApiResponse(true, saveMarchant, 200, "Marchant Created sucesfully")
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
// =======get all marchant======
const getAllMarchantControler = async (req, res) => {
  try {
    // =====get all marchant====
    const allMarchant = await marchantModel.find({});
    if (allMarchant) {
      return res
        .status(200)
        .json(
          new ApiResponse(true, allMarchant, 200, "Marchant get sucesfully")
        );
    }
    // ===return no marchant response=====
    return res
      .status(401)
      .json(new ApiError(false, null, 401, "no marchant found"));

    // ========throwing Error======
  } catch (error) {
    return res
      .status(501)
      .json(
        new ApiError(
          false,
          null,
          501,
          `getAllMArchantControler Error:  ${error} !!`
        )
      );
  }
};
// =======update marchant Controler=======
const UpdateMarchantControler = async (req, res) => {
  try {
    const { id } = req.params;
    const { Users, StoreName, TelePhone, EmailAddress } = req.body;
    // =====validation=====
    if (!EmailAddress || !EamilChecker(EmailAddress)) {
      return res
        .status(404)
        .json(
          new ApiError(false, null, 404, `EmailAddress missing or in valid!!`)
        );
    }
    if (!Users || !StoreName || !TelePhone) {
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
    // =======find marchant======
    const findMarchant = await marchantModel.findById(id);
    if (findMarchant) {
      // ====update Marchant====
      const updatemarchant = await marchantModel
        .findOneAndUpdate(
          { _id: id },
          {
            ...(EmailAddress && { EmailAddress }),
            ...(TelePhone && { TelePhone }),
            ...(StoreName && { StoreName }),
            ...(Users && { Users }),
          },
          { new: true }
        )
        .populate("Users");
      if (updatemarchant) {
        return res
          .status(200)
          .json(
            new ApiResponse(
              true,
              updatemarchant,
              200,
              "Marchant update sucesfully"
            )
          );
      }
    } else {
      return res
        .status(401)
        .json(new ApiError(false, null, 401, `cnan't Update Marchant !!`));
    }

    // ======update marchant======
  } catch (error) {
    return res
      .status(501)
      .json(
        new ApiError(
          false,
          null,
          501,
          `UpdateMarchatControler Error:  ${error} !!`
        )
      );
  }
};
// ======get Single Marchant=======
const getSingleMarchatControler = async (req, res) => {
  try {
    const { id } = req.params;
    const findSingleMarchat = await marchantModel.findById(id);
    if (findSingleMarchat) {
      return res
        .status(200)
        .json(
          new ApiResponse(
            true,
            findSingleMarchat,
            200,
            "Marchant get sucesfully"
          )
        );
    } else {
      return res
        .status(401)
        .json(new ApiError(false, null, 401, `marchant not found !!`));
    }
  } catch (error) {
    return res
      .status(501)
      .json(
        new ApiError(
          false,
          null,
          501,
          `getSingleMarchatControler Error:  ${error} !!`
        )
      );
  }
};
module.exports = {
  createMarchantControler,
  getAllMarchantControler,
  UpdateMarchantControler,
  getSingleMarchatControler,
};
