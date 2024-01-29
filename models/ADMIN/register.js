const mongoose = require('mongoose');
const multer = require('multer');

const imagePath = "/uploades/Admins";
const path = require('path');

const RegisterSchema = mongoose.Schema({
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
    mangerids:{
        type:Array,
        ref:'Manager'
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

RegisterSchema.statics.uploadImage = multer({ storage: ImageStorage }).single("image");
RegisterSchema.statics.imagePath = imagePath;

const registerData = mongoose.model('Register', RegisterSchema);
module.exports = registerData;