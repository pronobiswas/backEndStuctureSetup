const { ApiError } = require("../Utils/ApiError.js");
const { ApiResponse } = require("../Utils/ApiResponse.js");
const { asyncHandeler } = require("../Utils/asyncHandeler.js");
const { userModel } = require("../Model/user.model.js");
const { EamilChecker, passwordChecker } = require("../Utils/Checker.js");
const { bcryptPassword } = require("../Helper/Helper.js");

/**
 * @param{{req.body}} req
 * @param {{}} res
 **/
const CreateUser = asyncHandeler(async (req, res) => {
  try {
    const {
      FirstName,
      LastNane,
      EmailAddress,
      TelePhone,
      Address1,
      Address2,
      City,
      PostCode,
      Devision,
      District,
      Password,
    } = req?.body;

    if (!FirstName) {
      return res
        .status(404)
        .json(new ApiError(false, null, 400, `FirstName missing!!`));
    }
    if (!LastNane) {
      return res
        .status(404)
        .json(new ApiError(false, null, 400, `LastNane missing!!`));
    }
    if (!EmailAddress || !EamilChecker(EmailAddress)) {
      return res
        .status(404)
        .json(
          new ApiError(false, null, 404, `EmailAddress missing or in valid!!`)
        );
    }
    if (!TelePhone) {
      return res
        .status(404)
        .json(new ApiError(false, null, 404, `TelePhone missing!!`));
    }
    if (!Address1) {
      return res
        .status(404)
        .json(new ApiError(false, null, 404, `TelePhone missing!!`));
    }
    if (!Address2) {
      return res
        .status(404)
        .json(new ApiError(false, null, 404, `Address2 missing!!`));
    }
    if (!City) {
      return res
      .status(404)
      .json(new ApiError(false, null, 500, `City missing!!`));
    }
    if (!PostCode) {
      return res
        .status(404)
        .json(new ApiError(false, null, 404, `PostCode missing!!`));
    }
    if (!Devision) {
      return res
        .status(404)
        .json(new ApiError(false, null, 404, `Devision missing!!`));
    }
    if (!District) {
      return res
        .status(404)
        .json(new ApiError(false, null, 404, `District missing!!`));
    }
    if (!Password || !passwordChecker(Password)) {
      return res
        .status(404)
        .json(new ApiError(false, null, 404, `Password missing!!`));
    }

    // =======check is user alredy exixt=========

    const ExistUser = await userModel.find({
      $or: [{ EmailAddress: EmailAddress }, { TelePhone: TelePhone }],
    });
    if (ExistUser) {
      res.status(404).json(new ApiError(false, null, 400, `User alrady exist`));
    }

    // now make a  password encrypt
    const hashPassword = await bcryptPassword(Password);

    // save data in database
    const Users = await new userModel({
      FirstName,
      LastNane,
      EmailAddress,
      TelePhone,
      Address1,
      Address2,
      City,
      PostCode,
      Devision,
      District,
      Password:hashPassword,
    }).save();

    // =======create a accessToken=====
    // const token = await userModel.generateAccesToken()
    // console.log(token);



    // if (Users) {
    //    res
    //     .status(200)
    //     .json(
    //       new ApiResponse(
    //         true,
    //         Users,
    //         200,
    //         null,
    //         "user create successfully"
    //       )
    //     );
    // }

    return res
    .status(200)
    .json(
      new ApiResponse(
        true,
        Users,
        200,
        null,
        "user create successfully"
      )
    )
  } catch (error) {
    console.log(`failed create  data on database : ${error}`);
  }
});

module.exports = { CreateUser };
