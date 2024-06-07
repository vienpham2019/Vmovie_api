"use strict";

const { OK } = require("../core/success.response");
const ProductOptionService = require("../service/productOption.service");

class ProductOptionController {
  // Get
  isOptionTypeExists = async (req, res, next) => {
    new OK({
      message: "Get all options type successfully!",
      metadata: await ProductOptionService.isOptionTypeExists(req.params),
    }).send(res);
  };
  getAllOptionsByType = async (req, res, next) => {
    new OK({
      message: "Get all options type successfully!",
      metadata: await ProductOptionService.getAllOptionsByType(req.params),
    }).send(res);
  };
  getAllProductOptionTypes = async (req, res, next) => {
    new OK({
      message: "Get all option types successfully!",
      metadata: await ProductOptionService.getAllOptionTypes(),
    }).send(res);
  };
  // Create
  createProductOption = async (req, res, next) => {
    new OK({
      message: "Create Product Option successfully!",
      metadata: await ProductOptionService.createProductOption(req.body),
    }).send(res);
  };
  createProductSubOption = async (req, res, next) => {
    new OK({
      message: "Create Product Sub Option successfully!",
      metadata: await ProductOptionService.createProductSubOption(req.body),
    }).send(res);
  };
  // Update
  updateProductOption = async (req, res, next) => {
    new OK({
      message: "Update Product Option successfully!",
      metadata: await ProductOptionService.updateProductOption(req.body),
    }).send(res);
  };
  // Delete
  deleteProductOptionById = async (req, res, next) => {
    new OK({
      message: "Delete Product Option successfully!",
      metadata: await ProductOptionService.deleteProductOptionById(req.params),
    }).send(res);
  };

  deleteAllProductOptionByType = async (req, res, next) => {
    new OK({
      message: "Delete All Product Option successfully!",
      metadata: await ProductOptionService.deleteAllOptionByType(req.params),
    }).send(res);
  };
}

module.exports = new ProductOptionController();
