const { ApiError } = require("../Utils/ApiError");
const { ApiResponse } = require("../Utils/ApiResponse.js");
const categoryModel = require("../Model/category.model.js");
const { EamilChecker } = require("../Utils/Checker.js");
const { userModel } = require("../Model/user.model.js");

// ==============createcategort-controler=================
const createCategoryControler = async (req, res) => {
  console.log("this is catrgoryControler");
  try {
    // ======distruct data From boody=====
    const { title, description } = req.body;
    // =========validation=====
    if (!title || !description) {
      return res
        .status(404)
        .json(new ApiError(false, null, 404, `Title or Description Missing!!`));
    }
    // =====is category allredy Exist in database========
    const findCategory = await categoryModel.find({ title: title });
    if (findCategory?.length) {
      return res
        .status(404)
        .json(new ApiError(false, null, 400, `category allredy eXist !!`));
    }
    // =====save the category in database=====
    const categoryInstance = await new categoryModel({
      title: title,
      description: description,
    }).save();
    // =======return the success response=====
    if (categoryInstance) {
      return res
        .status(200)
        .json(
          new ApiResponse(false, null, 200, `category create successfully!!`)
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
          `createCategoryControler Error:  ${error} !!`
        )
      );
  }
};
// ====get all category=====
const getallCategoryControler = async (req, res) => {
  try {
    // =========get allcategory form database=======
    const allcategory = await categoryModel.find({});
    // ========sent response=====
    if (allcategory) {
      return res
        .status(200)
        .json(
          new ApiResponse(
            true,
            allcategory,
            200,
            null,
            "here is all those Category"
          )
        );
    } else {
      return res
        .status(404)
        .json(new ApiError(false, null, 400, `Category not found !!`));
    }
  } catch (error) {
    return res
      .status(501)
      .json(
        new ApiError(
          false,
          null,
          400,
          `getallCategoryControler Error:  ${error} !!`
        )
      );
  }
};
// ===========get A single category=====
const getSingleCategoryControler = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    // ====find the single category========
    const singleCategory = await categoryModel.findById({ _id: id });
    // ====just return if not found=====
    if (!singleCategory) {
      return null;
    }
    // ==========sent response=====
    return res
      .status(200)
      .json(
        new ApiResponse(
          true,
          singleCategory,
          200,
          null,
          "here is all those Category"
        )
      );
  } catch (error) {
    return res
      .status(501)
      .json(
        new ApiError(false, null, 400, `getSingleCategory Error:  ${error} !!`)
      );
  }
};
// ======approve category=====
const approveCategoryControler = async (req, res) => {
  try {
    const { EmailAddress, categoryID } = req.body;
    // ==========validation=====
    if (!EmailAddress || !EamilChecker(EmailAddress)) {
      return res
        .status(404)
        .json(
          new ApiError(false, null, 404, `EmailAddress missing or in valid!!`)
        );
    }
    if (!categoryID) {
      return res
        .status(404)
        .json(
          new ApiError(false, null, 404, `CategoryID missing or in valid!!`)
        );
    }
    // =====find and match user creadential============
    const findUser = await userModel.findOne({ EmailAddress: EmailAddress });
    // if (findUser) {
    //   return res
    //     .status(200)
    //     .json(
    //       new ApiResponse(
    //         true,
    //         findUser,
    //         200,
    //         null,
    //         "here is all those Category"
    //       )
    //     );
    // }
    // =====check does this user is admin?========
    if (findUser.Role !== "admin") {
      return res
        .status(400)
        .json(
          new ApiError(false, null, 400, "Only admin can Approve")
        );
    }
    // ======find the category=======
    const findCategory = await categoryModel.findById(categoryID);
    // =====Now active the category and return response====
    if(findCategory){
        findCategory.isActive = true;
        findCategory.save()
        return res
        .status(200)
        .json(
            new ApiResponse(
                true,
                findCategory,
                200,
                null,
                "category approved successfully"
            )
        )
    }else{
        return res
      .status(501)
      .json(
        new ApiError(
          false,
          null,
          501,
          `category not found !!`
        )
      );
    }
  } catch (error) {
    return res
      .status(501)
      .json(
        new ApiError(
          false,
          null,
          400,
          `approveCategoryControler Error:  ${error} !!`
        )
      );
  }
};
module.exports = {
  createCategoryControler,
  getallCategoryControler,
  getSingleCategoryControler,
  approveCategoryControler,
};
