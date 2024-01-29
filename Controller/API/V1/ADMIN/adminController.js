const Admin = require('../../../../models/ADMIN/register');
const bcrypt = require('bcrypt');
const jwtDAta = require('jsonwebtoken');
const manager = require("../../../../models/Manager/Manager");
const User  = require("../../../../models/User/User");
const path = require('path');
const fs = require('fs');

module.exports.register = async (req, res) => {
    try {
        let checkEmail = await Admin.findOne({ email: req.body.email });
        if (checkEmail) {
            return res.status(400).json({ mes: 'Email is Already Exist', status: 0 });
        }
        else {
            let cpass = req.body.confirm_pass;
            if (cpass == req.body.password) {
                var imagePath = '';
                if (req.file) {
                    imagePath = Admin.imagePath + "/" + req.file.filename
                }
                req.body.image = imagePath;
                req.body.password = await bcrypt.hash(req.body.password, 10);
                let ReData = await Admin.create(req.body);
                if (ReData) {
                    return res.status(200).json({ mes: 'Record is Insert', status: 1 });
                }
                else {
                    return res.status(200).json({ mes: 'Record is Not Insert', status: 0 });
                }
            }
            else {
                return res.status(200).json({ mes: 'Confirm password is not match', status: 0 });
            }

        }
    }
    catch (err) {
        return res.status(400).json({ mes: 'Record is Not Found', status: 0 });
    }
}


module.exports.login = async (req, res) => {
    try {
        let checkEmail = await Admin.findOne({ email: req.body.email });
        if (checkEmail) {
            if (await bcrypt.compare(req.body.password, checkEmail.password)) {
                let token = await jwtDAta.sign({ Admindata: checkEmail }, 'akshar', { expiresIn: '1h' });
                return res.status(200).json({ mes: 'Login is success', status: 1, record: token });
            }
            else {
                return res.status(200).json({ mes: 'password is not match', status: 0 });
            }
        }
        else {
            return res.status(200).json({ mes: 'Invalid Email', status: 0 });
        }
    }
    catch (err) {
        return res.status(400).json({ mes: 'Record is Not Found', status: 0 });
    }
}
// view all admin data
module.exports.alladminrecord = async (req, res) => {
    try {
        let alladminrecord = await Admin.find({});
        if (alladminrecord) {
            return res.status(200).json({ mes: 'view admin data', status: 1, ad: alladminrecord });
        }
        else {
            return res.status(200).json({ mes: 'admin data is not found', status: 0});
        }
    }
    catch (err) {
        return res.status(400).json({ mes: 'Record is Not Found', status: 0 });
    }
}


//show admin profile
module.exports.adminprofile = async(req,res)=>{
    try{
        let Adminrprofile = await Admin.findById(req.user.id).populate('mangerids').exec();
        return res.status(200).json({ mes: 'admin data is hear', status: 1, adminrecord:Adminrprofile}); 
    }
    catch (err) {
        return res.status(400).json({ mes: 'Somthing wrong', status: 0 });
    }
}
//edit admin profile
module.exports.editadmin = async(req,res)=>{
    try {
        // console.log(req.file);
        // console.log(req.params.id);
        if (req.file) {
            let oldImg = await Admin.findById(req.params.id);
            console.log(oldImg);
            if (oldImg.image) {
                let fullPath = path.join(__dirname, "../../../..", oldImg.image);
                console.log(fullPath);
                await fs.unlinkSync(fullPath);
            }
            var imgPath = '';
            imgPath = Admin.imagePath + "/" + req.file.filename;
            req.body.image = imgPath;
        }
        else {
            let olddata = await Admin.findById(req.params.id);
            var imgpath = '';
            if (olddata) {
                imgpath = olddata.image;
            }
            req.body.image = imgpath;
        }
        let adminupdated = await Admin.findByIdAndUpdate(req.params.id, req.body);
        if (adminupdated) {
            let updateprofile = await Admin.find({})
            return res.status(200).json({ msg: 'Data Updated Succ....', status: 1, rec: updateprofile });
        }
        else {
            return res.status(400).json({ msg: 'not Updated Succ..', status: 0 });
        }
    }
    catch (err) {
        return res.status(400).json({ msg: "Something wrong", status: 0 });
    }
}
//show all manager record
module.exports.getallmanager = async(req,res)=>{
    try{
        let allmangerdata = await manager.find({});
        if(allmangerdata){
            return res.status(200).json({ mes: 'view all manger data', status: 1, mr: allmangerdata });
        }
        else{
            return res.status(200).json({ mes: 'manager data is not found', status: 0});
        }
    }
    catch (err) {
        return res.status(400).json({ mes: 'Somthing wrong', status: 0 });
    }

}

//view all user data
module.exports.getallUser = async(req,res)=>{
    try{
        let allUserdata = await User.find({});
        if(allUserdata){
            return res.status(200).json({ mes: 'view all User data by admin', status: 1, ur: allUserdata });
        }
        else{
            return res.status(200).json({ mes: 'User data is not found', status: 0});
        }
    }
    catch (err) {
        return res.status(400).json({ mes: 'Somthing wrong', status: 0 });
    }

}