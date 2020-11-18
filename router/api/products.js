const express = require("express");
const passport = require("passport");
const router = express.Router();
const ProductsService = require("../../services/products");

const productService = new ProductsService();

const validation = require("../../utils/middlewares/validationHandler");

const {
  productIdSchema,
  productTagSchema,
  createProductSchema,
  updateProductSchema,
} = require("../../utils/squemas/products");

// JWT strategy
require("../../utils/auth/strategies/jwt");

router.get("/", async function (req, res, next) {
  const { tags } = req.query;

  try {
    const products = await productService.getProducts({ tags });
    res.status(200).json({
      data: products,
      message: "products listed",
    });
  } catch (error) {
    next(error);
  }
});

router.get("/:productId", async function (req, res, next) {
  const { productId } = req.params;
  try {
    const product = productService.getProduct({ productId });

    res.status(200).json({
      data: product,
      message: "product retrieved",
    });
  } catch (error) {
    next(error);
  }
});

router.post("/", validation(createProductSchema), async function (
  req,
  res,
  next
) {
  const { body: product } = req;

  try {
    const productResponse = productService.createProduct({ product });
    res.status(201).json({
      data: productResponse,
      message: "products listed",
    });
  } catch (error) {
    next(error);
  }
});

router.put(
  "/:productId",
  passport.authenticate("jwt", { session: false }),
  validation({ productId: productIdSchema }, "params"),
  validation(updateProductSchema),
  async function (req, res, next) {
    const { productId } = req.params;
    const { body: product } = req;
    try {
      const productRes = productService.updateProduct({ productId, product });

      res.status(200).json({
        data: productRes,
        message: "products updated",
      });
    } catch (error) {
      next(error);
    }
  }
);

router.delete("/", function (req, res, next) {
  const { productId } = req.params;
  try {
    const product = productService.deleteProduct({ productId });

    res.status(200).json({
      data: product,
      message: "products deleted",
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
