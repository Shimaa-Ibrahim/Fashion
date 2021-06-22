const Product = require("../models/product");
const Tag = require("../models/tag");

exports.getProducts = async (req, res, next) => {
  const query = req.query.filter ? req.query.filter.split(":") : null;
  const obj = query ? { [query[0]]: query[1] } : {};
  try {
    const products = await Product.find(obj)
      .populate("tags", ["_id", "name"])
      .populate("categoryID", ["_id", "name"])
      .populate("subCategoryID", ["_id", "name"]);
    res.status(200).json({ products: products });
  } catch (err) {
    next(err);
  }
};

exports.createProduct = async (req, res, next) => {
  const { name, desc, price, categoryID, subCategoryID, tags } = req.body;
  const imageURL = req.file ? `images/${req.file.filename}` : undefined;
  try {
    const product = new Product({
      name,
      desc,
      price,
      imageURL,
      categoryID,
      subCategoryID
    });
    if (typeof tags === "string") {
      const tagsArr = JSON.parse(tags);
      product.tags.push(...tagsArr);
    } else {
      product.tags.push(...tags);
    }
    const createdProduct = await product.save();
    const newProduct = await createdProduct
      .populate("tags", ["_id", "name"])
      .populate("categoryID", ["_id", "name"])
      .populate("subCategoryID", ["_id", "name"])
      .execPopulate();

    res.status(200).json({ message: "Product created", product: newProduct });
  } catch (err) {
    next(err);
  }
};

exports.updateProduct = async (req, res, next) => {
  const { id, name, desc, price, categoryID, subCategoryID, tags } = req.body;
  const imageURL = req.file ? req.file.path : undefined;
  let tagsArr = tags;

  if (typeof tags === "string") {
    tagsArr = JSON.parse(tags);
  }

  try {
    const prod = await Product.findById(id);
    prod.name = name ? name : prod.name;
    prod.desc = desc ? desc : prod.desc;
    prod.price = price ? price : prod.price;
    prod.categoryID = categoryID ? categoryID : prod.categoryID;
    prod.subCategoryID = subCategoryID ? subCategoryID : prod.subCategoryID;
    prod.imageURL = imageURL ? imageURL : prod.imageURL;
    prod.tags = tagsArr;

    const product = await prod.save();
    const updatedProduct = await product
      .populate("tags", ["_id", "name"])
      .populate("categoryID", ["_id", "name"])
      .populate("subCategoryID", ["_id", "name"])
      .execPopulate();

    res
      .status(200)
      .json({ message: "Product created", product: updatedProduct });
  } catch (err) {
    next(err);
  }
};

exports.modifyProductTags = async (req, res, next) => {
  const { id, tagID } = req.body;
  const type = req.query.type == "add" ? "$push" : "$pull";

  try {
    const product = await Product.findByIdAndUpdate(
      { _id: id },
      { [type]: { tags: tagID } },
      { new: true }
    );
    if (type != "add") {
      await Tag.updateMany({ _id: tagID }, { $pull: { products: id } });
    }
    const updatedProduct = await product
      .populate("tags", ["_id", "name"])
      .populate("categoryID", ["_id", "name"])
      .populate("subCategoryID", ["_id", "name"])
      .execPopulate();

    res
      .status(200)
      .json({ message: "product tags updated", product: updatedProduct });
  } catch (err) {
    next(err);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    await product.deleteOne();
    res.status(200).json({ message: "Product deleted", product: product });
  } catch (err) {
    next(err);
  }
};
