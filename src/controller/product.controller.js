"use strict";

const { OK } = require("../core/success.response");
const ProductService = require("../service/product.service");

class ProductController {
  // Get
  getAllTypes = async (req, res, next) => {
    new OK({
      message: "Get all type successfully!",
      metadata: await ProductService.getAllTypes(),
    }).send(res);
  };

  // Create
  createProduct = async (req, res, next) => {
    new OK({
      message: "Create Product successfully!",
      metadata: await ProductService.createProduct({ payload: req.body }),
    }).send(res);
  };
}
module.exports = new ProductController();
