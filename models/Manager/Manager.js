const mongoose = require('mongoose');
const multer = require('multer');

const imagePath = "/uploades/Manager";
const path = require('path');

const ManagerSchema = mongoose.Schema({
    username: {
        type: String,
    },
    email: {
        type: String,
    },
    password: {
        type: String,
    },    
    image: {
        type : String
    },
    adminIds:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Register',
        required : true
    }
})

const ImageStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "../..", imagePath));
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + "-" + Date.now());
    }
})

ManagerSchema.statics.uploadImage = multer({ storage: ImageStorage }).single("image");
ManagerSchema.statics.imagePath = imagePath;

const Manager = mongoose.model('Manager', ManagerSchema);
module.exports = Manager;