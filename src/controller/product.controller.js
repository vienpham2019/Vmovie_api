"use strict";

const { OK } = require("../core/success.response");
const ProductService = require("../service/product.service");

class ProductController {
  // Get
  getProductDetails = async (req, res, next) => {
    new OK({
      message: "Get product details successfully!",
      metadata: await ProductService.getProductDetails(req.params),
    }).send(res);
  };

  getAllTypes = async (req, res, next) => {
    new OK({
      message: "Get all type successfully!",
      metadata: await ProductService.getAllTypes(),
    }).send(res);
  };

  getAllProductByAdmin = async (req, res, next) => {
    new OK({
      message: "Get product successfully!",
      metadata: await ProductService.getAllProductByAdmin(req.query),
    }).send(res);
  };

  // Create
  createProduct = async (req, res, next) => {
    new OK({
      message: "Create Product successfully!",
      metadata: await ProductService.createProduct({ payload: req.body }),
    }).send(res);
  };

  // Update
  updateProduct = async (req, res, next) => {
    new OK({
      message: "Update Product successfully!",
      metadata: await ProductService.updateProduct({
        payload: req.body,
        _id: req.params._id,
      }),
    }).send(res);
  };

  // Update
  deleteProductById = async (req, res, next) => {
    new OK({
      message: "Delete Product successfully!",
      metadata: await ProductService.deleteProductById({
        _id: req.params._id,
      }),
    }).send(res);
  };
}
module.exports = new ProductController();
