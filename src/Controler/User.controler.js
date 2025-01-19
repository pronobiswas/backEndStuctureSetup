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

const options = {
  httpOnly: true,
  secure: false,
};
// =======create user=========
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
      // address1,
      // address2,
      // city,
      // postCode,
      // devision,
      // district,
      password: hashPassword,
    }).save();

    // ===make otp====
    const otp = await MakeOtp();
    // ======dending email=====
    const mailInfo = await sendMail(emailAddress, firstName, otp);
    console.log(mailInfo);

    // now set the OTP on database
    if (Users || mailInfo) {
      const setOTP = await userModel.findOneAndUpdate(
        { _id: Users._id },
        { $set: { otp: otp } },
        { new: true }
      );
      // ========return the tthe success response=======
      if (setOTP) {
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
    const findUser = await userModel.findOne({ emailAddress: emailAddress });
    if (!findUser) {
      return res
        .status(404)
        .json(new ApiError(false, null, 404, `Creadiantial not found!!`));
    }
    // =====check userIs veryFied======
    if (!findUser.userIsVeryFied) {
      return res
        .status(404)
        .json(new ApiError(false, null, 404, `Veryfi your mail..!!`));
    }
    // =========password valigation======
    const userPasswordIsValid = await decodeHashPassword(
      password,
      findUser?.password
    );
    if (!userPasswordIsValid) {
      return res
        .status(404)
        .json(new ApiError(false, null, 404, `Creadiantial Error!!`));
    }
    // =======create a accessToken=====
    const accessToken = await generateAccesToken(emailAddress ,findUser._id);

    // ======check credential=======
    if (findUser && userPasswordIsValid) {
      // now set the token on database
      const setToken = await userModel
        .findOneAndUpdate(
          { _id: findUser._id },
          { $set: { token: accessToken } },
          { new: true }
        )
        .select("-password");

      return (
        res
          .status(200)
          // ==set token in cokies===
          .cookie("Token", accessToken, {
            httpOnly: true,
            secure: false, // Ensure HTTPS is used
            sameSite: "None", // Allow cross-origin cookies
          })
          .json(new ApiResponse(true, setToken, 200, null, "login  sucesfull"))
      );
    } else {
      return res
        .status(404)
        .json(new ApiError(false, null, 404, `creadential Error`));
    }
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
  try {
    const { emailAddress, otp } = req.body;
    console.log(emailAddress);

    // return;

    // ===email vaidation=======
    if (!emailAddress || !EamilChecker(emailAddress)) {
      return res
        .status(404)
        .json(
          new ApiError(false, null, 404, `EmailAddress missing or in valid!!`)
        );
    }
    // ==========OTP vaidation=========
    if (!otp) {
      return res
        .status(404)
        .json(new ApiError(false, null, 404, `OTP missing or in valid!!`));
    }
    // =====find and match user creadential============
    const findUser = await userModel.findOne({ emailAddress: emailAddress });
    if (!findUser) {
      return res
        .status(404)
        .json(new ApiError(false, null, 404, `User doesnot Exist`));
    }

    if (findUser.otp == otp) {
      findUser.userIsVeryFied = "true";
      findUser.otp = null;
      await findUser.save();
      return res
        .status(200)
        .json(
          new ApiResponse(true, findUser, 200, null, "OTP matching sucesfull")
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

// =======forgot password controler===========
const forgotPasswordControler = async (req, res) => {
  console.log("from forgot password");
  try {
    const { emailAddress } = req.body;
    console.log(emailAddress);

    // ===email vaidation=======
    if (!emailAddress || !EamilChecker(emailAddress)) {
      return res
        .status(404)
        .json(
          new ApiError(false, null, 404, `EmailAddress missing or in valid!!`)
        );
    }
    // =====find and match user creadential============
    const findUser = await userModel.findOne({ emailAddress: emailAddress });

    if (!findUser) {
      return res
        .status(404)
        .json(new ApiError(false, null, 400, `user not found !!`));
    }

    // ===make otp====
    const otp = await MakeOtp();
    // =======sent mail========
    await sendMail(emailAddress, findUser?.firstName, otp);
    // ======set and save otp====
    findUser.otp = otp;
    await findUser.save();
    // ======send response=======
    console.log(findUser);
    return res
      .status(200)
      .json(
        new ApiResponse(
          true,
          findUser,
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
          `forgot password Controller Error:  ${error} !!`
        )
      );
  }
};

// =======reset password controler===========
const restPasswordControler = async (req, res) => {
  console.log("from rest password controler");
  try {
    const { emailAddress, password } = req.body;

    // =====email and password validation========
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
    const findUser = await userModel.findOne({ emailAddress: emailAddress });

    if (!findUser) {
      return res
        .status(404)
        .json(new ApiError(false, null, 404, `user not exist!!`));
    }

    if (findUser) {
      // =======password encrypeted=========
      console.log(findUser);

      const hashPassword = await bcryptPassword(password);
      findUser.password = hashPassword;
      await findUser.save();
      // ======sent response=======
      return res
        .status(200)
        .json(
          new ApiResponse(
            true,
            findUser,
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
