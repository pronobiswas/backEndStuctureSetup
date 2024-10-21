const { ApiError } = require("../Utils/ApiError.js");
const { ApiResponse } = require("../Utils/ApiResponse.js");
const { asyncHandeler } = require("../Utils/asyncHandeler.js");
const { userModel } = require("../Model/user.model.js");
const { EamilChecker, passwordChecker } = require("../Utils/Checker.js");
const {
  bcryptPassword,
  decodeHashPassword,
  generateAccesToken,
} = require("../Helper/Helper.js");
const { sendMail } = require("../Utils/SendMail.js");
const { MakeOtp } = require("../Helper/OtpGenaretor.js");

/**
 * @param{{req.body}} req
 * @param {{}} res
 **/
const options = {
  httpOnly: true,
  secure: true,
};
// =======creaye user=========
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

    if (ExistUser?.length) {
      return res
        .status(404)
        .json(new ApiError(false, null, 400, `User alrady exist`));
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

    // ===make otp====
    const otp = await MakeOtp();
    console.log(otp);
    // ======dending email=====
    const mailInfo = await sendMail(EmailAddress, FirstName, otp);
    console.log(mailInfo);

    if (Users || mailInfo) {
      // now set the OTP on database
      const setOTP = await userModel.findOneAndUpdate(
        { _id: Users._id },
        { $set: { OTP: otp } },
        { new: true }
      );

      const recentCreateUser = await userModel
        .find({ $or: [{ TelePhone }, { EmailAddress }] })
        .select("-Password");

      return res
        .status(200)
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
    return res
      .status(404)
      .json(
        new ApiError(
          false,
          null,
          400,
          `Registration Controller Error:  ${error} !!`
        )
      );
  }
});

// ================login Controler==========
const loginCrontroller = async (req, res) => {
  try {
    // ==========validation=====
    const { EmailAddress, Password } = req.body;
    if (!EmailAddress || !EamilChecker(EmailAddress)) {
      return res
        .status(404)
        .json(
          new ApiError(false, null, 404, `EmailAddress missing or in valid!!`)
        );
    }
    if (!Password || !passwordChecker(Password)) {
      return res
        .status(404)
        .json(new ApiError(false, null, 404, `Password missing!!`));
    }
    // ==========validation=====

    // =====find and match user creadential============
    const findUser = await userModel.findOne({ EmailAddress: EmailAddress });
    // =========password valigation======
    const userPasswordIsValid = await decodeHashPassword(
      Password,
      findUser?.Password
    );
    // =======create a accessToken=====
    const accessToken = await generateAccesToken(EmailAddress);
    // ======check credential=======
    if (findUser && userPasswordIsValid) {
      // now set the token on database
      const setToken = await userModel.findOneAndUpdate(
        { _id: findUser._id },
        { $set: { Token: accessToken } },
        { new: true }
      );
    } else {
      return res
        .status(404)
        .json(new ApiError(false, null, 404, `creadential Error`));
    }

    return (
      res
        .status(200)
        // ==set token in cokies===
        .cookie("Token", accessToken, options)
        .json(
          new ApiResponse(
            true,
            { user: "recentCreateUser" },
            200,
            null,
            "login  sucesfull"
          )
        )
    );
  } catch (error) {
    return res
      .status(404)
      .json(
        new ApiError(false, null, 400, `Login Controller Error:  ${error} !!`)
      );
  }
};
// =====otp match Controler========
const otpMatchControler = async (req, res) => {
  console.log("otp controler active");
  try {
    const { EmailAddress, OTP } = req.body;
    // ===email vaidation=======
    if (!EmailAddress || !EamilChecker(EmailAddress)) {
      return res
        .status(404)
        .json(
          new ApiError(false, null, 404, `EmailAddress missing or in valid!!`)
        );
    }
    // ==========OTP vaidation=========
    if (!OTP) {
      return res
        .status(404)
        .json(new ApiError(false, null, 404, `OTP missing or in valid!!`));
    }
    // =====find and match user creadential============
    const findUser = await userModel.findOne({ EmailAddress: EmailAddress });    
    if (!findUser) {
      return res
        .status(404)
        .json(new ApiError(false, null, 404, `User doesnot Exist`));
    }
    if (findUser.OTP == OTP) {
      findUser.OTP = null;
      await findUser.save()
      return res
      .status(200)
      .json(
        new ApiResponse(
          true,
          null,
          200,
          null,
          "OTP matching sucesfull"
        )
      );
    } else {
      return res
        .status(404)
        .json(new ApiError(false, null, 404, `OTP Doesn't match!!`));
    }
    // ====match OTP========
  } catch (error) {
    return res
      .status(404)
      .json(
        new ApiError(
          false,
          null,
          400,
          `otpMatchControler Controller Error:  ${error} !!`
        )
      );
  }
};

// =======get all regester user==========
const getAllRegisterUser = async (req, res) => {
  try {
    const allUser = await userModel.find({}).select("-Password -OTP -Token");
    if (allUser?.length) {
      return res
        .status(200)
        .json(
          new ApiResponse(true, allUser, 200, null, "Get AllUsers sucessfully")
        );
    }
  } catch (error) {
    return res
      .status(404)
      .json(
        new ApiError(
          false,
          null,
          400,
          `getAllRegisterUser Controller Error:  ${error} !!`
        )
      );
  }
};

module.exports = {
  CreateUser,
  loginCrontroller,
  otpMatchControler,
  getAllRegisterUser,
};
