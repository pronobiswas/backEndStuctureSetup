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
      firstName,
      lastName,
      emailAddress,
      telePhone,
      address1,
      address2,
      city,
      postCode,
      devision,
      district,
      password,
      token,
    } = req?.body;

    if (!firstName) {
      return res
        .status(404)
        .json(new ApiError(false, null, 400, `FirstName missing!!`));
    }
    if (!lastName) {
      return res
        .status(404)
        .json(new ApiError(false, null, 400, `LastNane missing!!`));
    }
    if (!emailAddress || !EamilChecker(emailAddress)) {
      return res
        .status(404)
        .json(
          new ApiError(false, null, 404, `EmailAddress missing or in valid!!`)
        );
    }
    if (!telePhone) {
      return res
        .status(404)
        .json(new ApiError(false, null, 404, `TelePhone missing!!`));
    }
    // if (!Address1) {
    //   return res
    //     .status(404)
    //     .json(new ApiError(false, null, 404, `TelePhone missing!!`));
    // }
    // if (!Address2) {
    //   return res
    //     .status(404)
    //     .json(new ApiError(false, null, 404, `Address2 missing!!`));
    // }
    // if (!City) {
    //   return res
    //     .status(404)
    //     .json(new ApiError(false, null, 500, `City missing!!`));
    // }
    // if (!PostCode) {
    //   return res
    //     .status(404)
    //     .json(new ApiError(false, null, 404, `PostCode missing!!`));
    // }

    // if (!Devision) {
    //   return res
    //     .status(404)
    //     .json(new ApiError(false, null, 404, `Devision missing!!`));
    // }
    // if (!District) {
    //   return res
    //     .status(404)
    //     .json(new ApiError(false, null, 404, `District missing!!`));
    // }
    if (!password || !passwordChecker(password)) {
      return res
        .status(404)
        .json(new ApiError(false, null, 404, `Password missing!!`));
    }

    // =======check is user alredy exixt=========
    const ExistUser = await userModel.find({
      $or: [{ emailAddress: emailAddress }, { telePhone: telePhone }],
    });

    if (ExistUser?.length) {
      return res
        .status(404)
        .json(new ApiError(false, null, 400, `User alrady exist`));
    }
    // =======password encrypeted=========

    // now make a  password encrypt
    const hashPassword = await bcryptPassword(password);

    // save data in database
    const Users = await new userModel({
      firstName,
      lastName,
      emailAddress,
      telePhone,
      address1,
      address2,
      city,
      postCode,
      devision,
      district,
      password: hashPassword,
    }).save();

    // ===make otp====
    const otp = await MakeOtp();
    console.log(otp);
    // ======dending email=====
    const mailInfo = await sendMail(emailAddress, firstName, otp);
    console.log(mailInfo);

    if (Users || mailInfo) {
      // now set the OTP on database
      const setOTP = await userModel.findOneAndUpdate(
        { _id: Users._id },
        { $set: { OTP: otp } },
        { new: true }
      );

      const recentCreateUser = await userModel
        .find({ $or: [{ telePhone }, { emailAddress }] })
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
    const { emailAddress, password } = req.body;
    // ==========validation=====
    if (!emailAddress || !EamilChecker(emailAddress)) {
      return res
        .status(404)
        .json(
          new ApiError(false, null, 404, `EmailAddress missing or in valid!!`)
        );
    }
    if (!password || !passwordChecker(password)) {
      return res
        .status(404)
        .json(new ApiError(false, null, 404, `Password missing!!`));
    }
    // =====find and match user creadential============
    const findUser = await userModel.findOne({ EmailAddress: EmailAddress });
    // =========password valigation======
    const userPasswordIsValid = await decodeHashPassword(
      password,
      findUser?.password
    );
    // =======create a accessToken=====
    const accessToken = await generateAccesToken(emailAddress);
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
      await findUser.save();
      return res
        .status(200)
        .json(new ApiResponse(true, null, 200, null, "OTP matching sucesfull"));
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

// =======forgot password controler===========
const forgotPasswordControler = async (req, res) => {
  console.log("from forgot password");
  try {
    const { EmailAddress } = req.body;
    // ===email vaidation=======
    if (!EmailAddress || !EamilChecker(EmailAddress)) {
      return res
        .status(404)
        .json(
          new ApiError(false, null, 404, `EmailAddress missing or in valid!!`)
        );
    }
    // =====find and match user creadential============
    const findUser = await userModel.findOne({ EmailAddress: EmailAddress });
    // ===make otp====
    const otp = await MakeOtp();
    // =======sent mail========
    await sendMail(EmailAddress, findUser.FirstName, otp);
    // ======set and save otp====
    findUser.OTP = otp;
    await findUser.save;
    // ======send response=======
    console.log(findUser);
    return res
      .status(200)
      .json(
        new ApiResponse(
          true,
          null,
          200,
          null,
          "Forgot sucesfull && check your email"
        )
      );
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

// =======reset password controler===========
const restPasswordControler = async (req, res) => {
  console.log("from rest password controler");
  try {
    const { EmailAddress, Password, OTP } = req.body;
    // =====email and password validation========
    if (!EmailAddress || !EamilChecker(EmailAddress)) {
      return res
        .status(404)
        .json(
          new ApiError(false, null, 404, `EmailAddress missing or in valid!!`)
        );
    }
    if (!Password || !passwordChecker(Password) || !OTP) {
      return res
        .status(404)
        .json(new ApiError(false, null, 404, `Password missing!!`));
    }
    // =====find and match user creadential============
    const findUser = await userModel.findOne({ EmailAddress: EmailAddress });
    console.log(findUser);

    if (!findUser) {
      return res
        .status(404)
        .json(new ApiError(false, null, 404, `user not exist!!`));
    }
    if (findUser.OTP == OTP) {
      // =======password encrypeted=========
      const hashPassword = await bcryptPassword(Password);
      findUser.Password = hashPassword;
      await findUser.save();
      // ======sent response=======
      return res
        .status(200)
        .json(
          new ApiResponse(
            true,
            null,
            200,
            null,
            "Forgot sucesfull && check your email"
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
          `restPasswordControler Controller Error:  ${error} !!`
        )
      );
  }
};

// ==========change Role==========
const roleChangeControler = async (req, res) => {
  try {
    console.log("from changeControler");
    const { EmailAddress, TelePhone, role } = req.body;
    // =====email validation========
    if (!EmailAddress || !EamilChecker(EmailAddress)) {
      return res
        .status(404)
        .json(
          new ApiError(false, null, 404, `EmailAddress missing or in valid!!`)
        );
    }
    // ========telephone validation==========
    if (!TelePhone || TelePhone.length < 9) {
      return res
        .status(404)
        .json(
          new ApiError(false, null, 404, `PhoneNumber missing or in valid!!`)
        );
    }
    // =====find and match user creadential============
    const findUser = await userModel.findOne({
      $or: [{ EmailAddress: EmailAddress }, { TelePhone: TelePhone }],
    });
    // ===========change Role=========
    if (findUser.Role === "user") {
      findUser.Role = role;
      await findUser.save();
      // ======sent response=======
      return res
        .status(200)
        .json(
          new ApiResponse(true, null, 200, null, "Role update  successfully")
        );
    } else {
      return res
        .status(200)
        .json(
          new ApiResponse(true, null, 200, null, "You are alredy merchent")
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
          `roleChangeControler Error:  ${error} !!`
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
  forgotPasswordControler,
  restPasswordControler,
  roleChangeControler,
  getAllRegisterUser,
};
