const subCategoryModel = require("../Model/subCategory.model");
const { ApiError } = require("../Utils/ApiError");
const { ApiResponse } = require("../Utils/ApiResponse.js");
const categoryModel = require('../Model/category.model.js')

const createSubCategory = async (req, res) => {
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
    // =========save data in database======
    const subCategoryInstance = await new subCategoryModel({
        title, description, category
    }).save();
    // =====marge subCategory into Category=====
    if(subCategoryInstance){
        // ====find theMain category by id=====
        const findCategory = await categoryModel.findById(category);
        // ======push the subcategory in main category======
        findCategory.subcategory.push(subCategoryInstance._id);
        findCategory.save()
        console.log(findCategory);
        return res
        .status(200)
        .json(
            new ApiResponse(
                true,subCategoryInstance,200,"Sub Category Created sucesfull"
            )
        )

        
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
module.exports = { createSubCategory };
