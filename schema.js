const Joi = require('joi');

module.exports.listingSchema = Joi.object({
    Listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        "image.url" : Joi.string().required(), //here i required lots of error solving
        location: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number().required(),
    }).required()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().required()
    }).required()
});