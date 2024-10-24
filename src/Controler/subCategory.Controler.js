const subCategoryModel = require("../Model/subCategory.model");
const { ApiError } = require("../Utils/ApiError");
const { ApiResponse } = require("../Utils/ApiResponse.js");
const categoryModel = require("../Model/category.model.js");

// ========create subCategory=====
const createSubCategoryControler = async (req, res) => {
  console.log("from subcategory controler");
  try {
    const { title, description, category } = req.body;
    // ======validation======
    if (!title || !description || !category) {
      return res
        .status(404)
        .json(
          new ApiError(false, null, 400, `sub Category credintail missing !!`)
        );
    }
    // =======check is subcategory alredy exist=====
    const findSubcategory = await subCategoryModel.find({ title: title });

    // =======return is subcategory alredy exist=====
    if (findSubcategory?.length) {
      return res
        .status(401)
        .json(
          new ApiError(
            false,
            findSubcategory,
            401,
            `subCategory alredy exist!!`
          )
        );
    }
    // =========save data in database======
    const subCategoryInstance = await new subCategoryModel({
      title,
      description,
      category,
    }).save();
    // =====marge subCategory into Category=====
    if (subCategoryInstance) {
      // ====find theMain category by id=====
      const findCategory = await categoryModel.findById(category);
      // ======push the subcategory in main category======
      findCategory.subcategory.push(subCategoryInstance._id);
      findCategory.save();
      console.log(findCategory);
      return res
        .status(200)
        .json(
          new ApiResponse(
            true,
            subCategoryInstance,
            200,
            "Sub Category Created sucesfull"
          )
        );
    }
    // -------if any problem occour then throw the error-------
  } catch (error) {
    return res
      .status(501)
      .json(
        new ApiError(
          false,
          null,
          400,
          `subCategoryControler Error:  ${error} !!`
        )
      );
  }
};
// =======getAll SubCategory======
const getAllSubCategoryControler = async (req, res) => {
  console.log("getAllSubCategoryControler subcategory");

  try {
    const allSubcategory = await subCategoryModel.find({}).populate("category");
    if (allSubcategory?.length) {
      return res
        .status(200)
        .json(
          new ApiResponse(false, allSubcategory, 400, `getAllSubCategory !!`)
        );
    } else {
      return res
        .status(400)
        .json(new ApiError(false, null, 400, `SubCategory not foud!!`));
    }
  } catch (error) {
    return res
      .status(501)
      .json(
        new ApiError(
          false,
          null,
          400,
          `getAllSubCategoryControler Error:  ${error} !!`
        )
      );
  }
};
// ======get A single Category======
const getSingleCategoryControler = async (req,res)=>{
    console.log("single category controler");
    try {
        const {id} = req.params;
        const singleSubcategory =await subCategoryModel.findById(id);
        if(singleSubcategory){
            return res.status(200).json(new ApiResponse(true,singleSubcategory,200,'single subcategory retrive successfully'))
        }else{return res.status(400).json(new ApiError(false,singleSubcategory,400,'single subcategory not found'))}
    } catch (error) {
        return res
      .status(501)
      .json(
        new ApiError(
          false,
          null,
          400,
          `getSingleCategoryControler Error:  ${error} !!`
        )
      );
    }
}
// =======delete SubCategory======
const deleteSubCategoryControler = async (req, res) => {
  console.log("delete subcategory");

  try {
    const { id } = req.params;
    // ====delete subcategory======
    const deleteSubCategory = await subCategoryModel.findOneAndDelete({
      _id: id,
    });
    // ========update the main category====
    if (deleteSubCategory) {
        // ========find main category=====
      const mainCategory = await categoryModel.findById(
        deleteSubCategory.category
      );
    //   ====update category====
      if (mainCategory) {
        mainCategory.subcategory.pull(deleteSubCategory._id);
        mainCategory.save();
        return res
          .status(200)
          .json(
            new ApiResponse(
              true,
              deleteSubCategory,
              200,
              null,
              "Sub Category Deleted  sucesfull"
            )
          );
      }else{return null}
    } else {
      return res
        .status(501)
        .json(
          new ApiError(
            false,
            "can't delete",
            501,
            `subCategoryControler Error:  ${error} !!`
          )
        );
    }
    // ==========thwow the the error=======
  } catch (error) {
    return res
      .status(501)
      .json(
        new ApiError(
          false,
          null,
          400,
          `subCategoryControler Error:  ${error} !!`
        )
      );
  }
};
module.exports = {
  createSubCategoryControler,
  getAllSubCategoryControler,
  getSingleCategoryControler,
  deleteSubCategoryControler,
};
