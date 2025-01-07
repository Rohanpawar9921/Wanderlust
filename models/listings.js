const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const review = require("./review.js")

const listingSchema = new Schema({
    title: {
        type: String,
        default: true
    },
    description: String,
    image: {
        type: Object,
        default:  {
            filename: "listingimage",
            url: "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHRyYXZlbHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
        },
    },
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ]
});

listingSchema.post("findOneAndDelete", async(listings) => {
    if (listings) {
            await review.deleteMany({_id: {$in: listings.reviews}})

    }
})

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;    