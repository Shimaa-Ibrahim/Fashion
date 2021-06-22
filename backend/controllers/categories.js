const Category = require('../models/category');
const Product = require('../models/product');

exports.getCategories = async (req, res, next) => {
    try {
        const categories = await Category.find({ categoryID: undefined })
            .populate("subCategories", ['_id', 'name']);
        res.status(200).json({ categories: categories });
    } catch (err) {
        next(err);
    }
};

exports.getCategory = async (req, res, next) => {
    try {
        const category = await Category.findById(req.params.id).populate("subCategories");
        res.status(200).json({ category: category });
    } catch (err) {
        next(err);
    }
};

exports.addCategory = async (req, res, next) => {
    const { name, details } = req.body;
    try {
        const category = new Category({
            name,
            details
        });
        await category.save();
        res.status(200).json({ category: category });
    } catch (err) {
        next(err);
    }
};

exports.addSubCategory = async (req, res, next) => {
    const { name, categoryID } = req.body;
    try {
        const category = new Category({
            name,
            categoryID
        });
        const createdCategory = await category.save();
        const parentCategory = await Category.findById(categoryID);
        parentCategory.subCategories.push(createdCategory.id);
        await parentCategory.save();
        res.status(200).json({ category: createdCategory });
    } catch (err) {
        next(err);
    }
};

exports.updateCategory = async (req, res, next) => {
    const { id, name, details } = req.body;
    try {
        const category = await Category.findById(id);
        category.name = name;
        category.details = details;
        await category.save();
        updatedCategory = await category.populate("subCategories").execPopulate();
        res.status(200).json({ category: updatedCategory });
    } catch (err) {
        next(err);
    }
};

exports.removeCategory = async (req, res, next) => {
    try {
        const deletedCategory = await Category.findOneAndDelete({ _id: req.params.id });
        if (deletedCategory && deletedCategory.categoryID) {
            await Category.findOneAndUpdate({ _id: deletedCategory.categoryID }, { $pull: { subCategories: deletedCategory._id } });
            await Product.updateMany({ subCategoryID: deletedCategory._id }, { subCategoryID: undefined });
        } else {
            await Category.deleteMany({ categoryID: deletedCategory._id });
            await Product.deleteMany({ categoryID: deletedCategory._id });
        }
        res.status(200).json({ message: "subcategory deleted", category: deletedCategory });
    } catch (err) {
        next(err);
    }
};
