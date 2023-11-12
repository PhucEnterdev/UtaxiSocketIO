const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LocationSchema = new Schema({
    phonenumber: {
        type: String
    },
    latitude: {
        type: String,
        required: true
    },
    longitude: {
        type: String,
        required: true
    },
    distance: {
        type: String
    }
},{
    timestamps: true
})

const Location = mongoose.model("Location", LocationSchema);
module.exports = Location;