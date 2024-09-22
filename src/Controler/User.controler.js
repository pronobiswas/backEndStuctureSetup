/**
 * @param{{req.body}} req
 * @param {{}} res
 **/
const { ApiError } = require("../Utils/ApiError.js");
const { ApiResponse } = require("../Utils/ApiResponse.js");
const { asyncHandeler } = require("../Utils/asyncHandeler.js");
const { userModel } = require("../Model/user.model.js");
const { EamilChecker, passwordChecker } = require("../Utils/Checker.js");

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
    } = req.body;

    if (!FirstName) {
      res
        .status(404)
        .json(new ApiError(false, null, 500, `FirstName missing!!`));
    }
    if (!LastNane) {
      res
        .status(404)
        .json(new ApiError(false, null, 500, `LastNane missing!!`));
    }
    if (!EmailAddress || !EamilChecker(EmailAddress)) {
      res
        .status(404)
        .json(
          new ApiError(false, null, 500, `EmailAddress missing or in valid!!`)
        );
    }
    if (!TelePhone) {
      res
        .status(404)
        .json(new ApiError(false, null, 500, `TelePhone missing!!`));
    }
    if (!Address1) {
      res
        .status(404)
        .json(new ApiError(false, null, 500, `TelePhone missing!!`));
    }
    if (!Address2) {
      res
        .status(404)
        .json(new ApiError(false, null, 500, `Address2 missing!!`));
    }
    if (!City) {
      res.status(404).json(new ApiError(false, null, 500, `City missing!!`));
    }
    if (!PostCode) {
      res
        .status(404)
        .json(new ApiError(false, null, 500, `PostCode missing!!`));
    }
    if (!Devision) {
      res
        .status(404)
        .json(new ApiError(false, null, 500, `Devision missing!!`));
    }
    if (!District) {
      res
        .status(404)
        .json(new ApiError(false, null, 500, `District missing!!`));
    }
    if (!Password || !passwordChecker(Password)) {
      res
        .status(404)
        .json(new ApiError(false, null, 500, `Password missing!!`));
    }

    const ExistUser = await userModel.find({
      $or: [{ EmailAddress: EmailAddress }, { TelePhone: TelePhone }],
    });
    if (ExistUser) {
      res.status(400).json(new ApiError(false, null, 500, `User alrady exist`));
    }

    // save data in database
    const createUserOnDatabase = await new userModel({
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
    }).save();

    if (createUserOnDatabase) {
      res
        .status(200)
        .json(
          new ApiResponse(
            true,
            createUserOnDatabase,
            200,
            null,
            "user create successfully"
          )
        );
    }
    res.end();
  } catch (error) {
    console.log(`failed create  data on database : ${error}`);
  }
});

module.exports = { CreateUser };
