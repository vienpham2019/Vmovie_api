"use strict ";

const { default: mongoose } = require("mongoose");
const {
  getSkip,
  getSelectData,
  convertToObjectIdMongoDB,
  getUnSelectData,
} = require("../../util");
const productModel = require("./product.model");
const { InternalServerError } = require("../../core/error.response");

// Get
const getAllProducts = async ({
  query,
  page,
  limit,
  sortBy,
  sortDir,
  select = [],
}) => {
  const totalProducts = await productModel.countDocuments({
    ...query,
  });

  const products = await productModel
    .find({ ...query })
    .select(getSelectData(select))
    .sort({ [sortBy]: Math.floor(sortDir) })
    .skip(getSkip({ page, limit }))
    .limit(limit)
    .lean()
    .exec();

  return {
    totalProducts,
    products,
  };
};

const getAllProdyctByType = async ({ type, select = [] }) => {
  try {
    return await productModel.find({ type }).select(getSelectData(select));
  } catch (error) {
    throw new InternalServerError(error);
  }
};

const getAllTypes = async () => {
  try {
    return await productModel.distinct("type");
  } catch (error) {
    throw new InternalServerError(error);
  }
};

const getProductDetails = async ({ _id, unSelect = [] }) => {
  try {
    return await productModel
      .findById(convertToObjectIdMongoDB(_id))
      .populate({
        path: "options.selected",
        select: "img isParent name optionType",
      })
      .select(getUnSelectData(unSelect))
      .lean()
      .exec();
  } catch (error) {
    throw new InternalServerError(error);
  }
};
// Create
const createProduct = async ({ payload }) => {
  try {
    return await productModel.create(payload);
  } catch (error) {
    throw new InternalServerError(error);
  }
};
// Update
const updateProduct = async ({ _id, payload }) => {
  try {
    // Construct the update object
    const updateData = { ...payload };

    // If options exist in the payload, set them explicitly
    if (payload.options) {
      updateData.options = payload.options;
    }

    // Update the product by ID with the constructed update data
    const updatedProduct = await productModel.findOneAndUpdate(
      { _id },
      { $set: updateData },
      { runValidators: true }
    );

    return updatedProduct;
  } catch (error) {
    throw new InternalServerError(error);
  }
};
// Delete
const deleteProductById = async ({ _id }) => {
  try {
    await productModel.findOneAndDelete({ _id: convertToObjectIdMongoDB(_id) });
  } catch (error) {
    throw new InternalServerError(error);
  }
};

const deleteOptionIdFromAllProducts = async ({ optionId }) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    // Convert option IDs to MongoDB ObjectId
    const optionObjectId = convertToObjectIdMongoDB(optionId);

    // Step 1: Remove the option ID from the selected field in all products
    await productModel.updateMany(
      {},
      { $pull: { "options.$[].selected": optionObjectId } }
    );
    // Step 2: Remove any options where selected is now empty in all products
    await productModel.updateMany(
      {},
      { $pull: { options: { selected: { $size: 0 } } } }
    );
    await session.commitTransaction();
    session.endSession();

    return { success: true };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw new InternalServerError(error);
  }
};

module.exports = {
  getAllProducts,
  getAllProdyctByType,
  getAllTypes,
  getProductDetails,
  createProduct,
  updateProduct,
  deleteProductById,
  deleteOptionIdFromAllProducts,
};
