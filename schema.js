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
