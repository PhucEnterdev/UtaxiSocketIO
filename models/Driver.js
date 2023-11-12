const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const DriverSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    fullName : {
        type: String,
    },
    email : {
        type: String,
        unique: true,
        lowercase: true
    },
    phonenumber: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
    },
    address: {
        type: String,
    },
    gender: {
        type: String,
        default: ""
    },
    avatar: {
        type: String,
        default: "",
    },
    role: {
        type: String,
        enum: ['driver'],
        default: 'driver'
    },
    image_cab: {
        type: String,
        default: "",
    },
    car_number_plates: {
        type: String,
    },
    access_token: {
        type: String
    },
    refresh_token: {
        type: String
    }
},{
    timestamps: true
})

const Driver = mongoose.model("Driver", DriverSchema);
module.exports = Driver