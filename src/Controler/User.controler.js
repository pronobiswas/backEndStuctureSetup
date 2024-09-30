const { ApiError } = require("../Utils/ApiError.js");
const { ApiResponse } = require("../Utils/ApiResponse.js");
const { asyncHandeler } = require("../Utils/asyncHandeler.js");
const { userModel } = require("../Model/user.model.js");
const { EamilChecker, passwordChecker } = require("../Utils/Checker.js");
const { bcryptPassword, generateAccesToken } = require("../Helper/Helper.js");
const { sendMail } = require("../Utils/SendMail.js");

/**
 * @param{{req.body}} req
 * @param {{}} res
 **/
const options = {
  httpOnly: true,
  secure: true,
};
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
      Token,
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
    // =======check is user alredy exixt=========

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
      Password: hashPassword,
    }).save();

    // =======create a accessToken=====
    const accessToken = await generateAccesToken(EmailAddress, TelePhone);
    const mailInfo = await sendMail(EmailAddress,FirstName)
    console.log(mailInfo);
    

    if (Users || accessToken) {
      // now set the tokrn on database
      const setToken = await userModel.findOneAndUpdate(
        { _id: Users._id },
        {$set:{Token:accessToken}},
        {new:true}
      );
      const recentCreateUser = await userModel
        .find({ $or: [{ TelePhone }, { EmailAddress }] })
        .select("-Password -_id");
      return res
        .status(200)
        .cookie("Token" , accessToken ,options)
        .json(
          new ApiResponse(
            true,
            recentCreateUser,
            200,
            null,
            "Registration  sucesfull"
          )
        );
    }
  } catch (error) {
    console.log(`failed create  data on database : ${error}`);
  }
});

module.exports = { CreateUser };
