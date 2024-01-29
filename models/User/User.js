const mongoose = require('mongoose');
const multer = require('multer');

const imagePath = "/uploades/User";
const path = require('path');

const UserSchema = mongoose.Schema({
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
})

const ImageStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "../..", imagePath));
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + "-" + Date.now());
    }
})

UserSchema.statics.uploadImage = multer({ storage: ImageStorage }).single("image");
UserSchema.statics.imagePath = imagePath;

const User = mongoose.model('User', UserSchema);
module.exports = User;