const Tag = require('../models/tag');

exports.getTags = async (req, res, next) => {
    try {
        const tags = await Tag.find({}).populate('products', ['_id', 'name']);
        res.status(200).json({ tags: tags });
    } catch (err) {
        next(err)
    }
}

exports.getTag = async (req, res, next) => {
    try {
        const tag = await Tag.findById(req.params.id).populate('products', ['_id', 'name']);
        res.status(200).json({ tags: tag });
    } catch (err) {
        next(err)
    }
}

exports.addTag = async (req, res, next) => {
    try {
        const tag = new Tag({
            name: req.body.name
        });

        const createdTag = await tag.save();
        res.status(200).json({ tag: createdTag });
    } catch (err) {
        next(err);
    }

}

exports.updateTag = async (req, res, next) => {
    const { id, name } = req.body;
    try {
        const tag = await Tag.findById(id);
        tag.name = name;
        await tag.save();
        res.status(200).json({ tag: tag });

    } catch (err) {
        next(err);
    }
}

exports.deleteTag = async (req, res, next) => {
    try {
        const tag = await Tag.findById(req.params.id);
        if(tag) await tag.deleteOne();
        res.status(200).json({ message: " Tag deleted", tag: tag });
    } catch (err) {
        next(err)
    }
}