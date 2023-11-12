require("dotenv").config();
const express = require("express");
const http = require('http');
const server = http.createServer(express);
const { Server } = require("socket.io");
const io = new Server(server);
const mongoose = require("mongoose");
const Location = require("./models/Location");
const Driver = require("./models/Driver");
const User = require("./models/User");
const {calculateDestinationCoordinates} = require("./utils/utils");

// connect database
mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("Connect database successfully"))
    .catch((err) => console.log(`Connect database failed with error ${err}`));

const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.json());

// socket io
io.on('connection', (data) => {
    console.log('connection received');
    data.on('driver_location', async (msg) => {
        const {access_token, phonenumber, latitude, longitude} = JSON.parse(msg);
        const driver_location = await Location.findOne({phonenumber})
        if(driver_location){
            driver_location.latitude = latitude;
            driver_location.longitude = longitude;
            await driver_location.save();
            console.log("Lưu xong rồi")
        }else{
            const driver_location = new Location({phonenumber, latitude, longitude});
            await driver_location.save();
            console.log("Tạo mới ok")
        }
    })

    data.on('customer_find', async (msg) => {
        const {access_token, phonenumber, latitude, longitude} = JSON.parse(msg);
        /*** Hàm tính tọa độ từ tọa độ người dùng cùng với hướng và khoảng cách */
        const {mLatitude, mLongitude} = calculateDestinationCoordinates(latitude, longitude, 45, 1); // 45 độ, 1km
        console.log(`Kinh do ${mLatitude}`)
        console.log(`Vi do ${mLongitude}`)
        /** Tìm ra 1 tài xế gần vị trí của customer */
        /*** - 0.001 mang tính chất tương đối */
        const location = await Location.findOne({latitude: {$lte: mLatitude - 0.001}, longitude: {$lte: mLongitude - 0.001}});
        if(location){
            const locationStr = JSON.stringify(location);
            console.log(locationStr)
            data.emit("driver_ready", locationStr)
        }else{
            const {mLatitude, mLongitude} = calculateDestinationCoordinates(latitude, longitude, 90, 1); // 90 độ, 1km
            console.log(`Kinh do ${mLatitude}`)
            console.log(`Vi do ${mLongitude}`)
            const location = await Location.findOne({latitude: {$lte: mLatitude - 0.001}, longitude: {$lte: mLongitude - 0.001}});
            if(location){
                const locationStr = JSON.stringify(location);
                console.log(locationStr)
                data.emit("driver_ready", locationStr)
            }else {
                const {mLatitude, mLongitude} = calculateDestinationCoordinates(latitude, longitude, 180, 1); // 90 độ, 1km
                console.log(`Kinh do ${mLatitude}`)
                console.log(`Vi do ${mLongitude}`)
                const location = await Location.findOne({latitude: {$lte: mLatitude - 0.001}, longitude: {$lte: mLongitude - 0.001}});
                if(location){
                    const locationStr = JSON.stringify(location);
                    console.log(locationStr)
                    data.emit("driver_ready", locationStr)
                }
            }
        }
    })

    data.on('customer_book', async (msg) => {
        const {phonenumber, driver, latitude, longitude} = JSON.parse(msg);
        console.log(`so dien thoai khach hang ${phonenumber}`)
        console.log(`so dien thoai tai xe ${driver}`)
        data.broadcast.emit(`customer_book_${driver}`, msg)
        console.log("da gui den tai xe")
    })
});

// start the server
const port = app.get("port") || process.env.PORT;
server.listen(4040, () => {
    console.log(`socket io is running at port ${port}`)
})