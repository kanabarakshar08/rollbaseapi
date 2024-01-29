const Manager = require("../../../../models/Manager/Manager");
const Admin = require("../../../../models/ADMIN/register");
const User = require("../../../../models/User/User")
const nodemailer = require("nodemailer");
const bcrypt = require('bcrypt');
const jwtDAta = require('jsonwebtoken');
const path = require('path');
const fs = require('fs')

// registreation manager by admine and send email and password 
module.exports.add_manager = async (req, res) => {
    try {
        let checkEmail = await Manager.findOne({ email: req.body.email })
        if (!checkEmail) {
            let cpass = req.body.confirm_pass;
            if (cpass == req.body.password) {
                let password = req.body.password;
                var imagePath = '';
                if (req.file) {
                    imagePath = Manager.imagePath + "/" + req.file.filename
                }
                req.body.image = imagePath;
                req.body.adminIds = req.user.id
                req.body.password = await bcrypt.hash(req.body.password, 10);
                let managerdata = await Manager.create(req.body);
                if (managerdata) {
                    let reg  = await Admin.findById(req.user.id);
                    reg.mangerids.push(managerdata.id);
                    await Admin.findByIdAndUpdate(req.user.id,reg);

                    const transporter = nodemailer.createTransport({
                        host: "smtp.gmail.com",
                        port: 465,
                        secure: true,
                        auth: {
                            // TODO: replace `user` and `pass` values from <https://forwardemail.net>
                            user: "kanabarakshar08@gmail.com",
                            pass: "hewmhckihdtvurqy",
                        },
                    });
                    const info = await transporter.sendMail({
                        from: 'kanabarakshar08@gmail.com', // sender address
                        to: req.body.email, // list of receivers
                        subject: "email id and password", // Subject line
                        text: "email and password", // plain text body
                        html: `<b>email : ${req.body.email}</b><br><b>password : ${password}</b>`, // html body
                    });
                    return res.status(200).json({ mes: 'MAnager Record is Insert', status: 1 });
                }
                else {
                    return res.status(200).json({ mes: 'MAnager Record is Not Insert', status: 0 });
                }
            }
            else {
                return res.status(200).json({ mes: 'Confirm password is not match', status: 0 });
            }

        }
        else {
            return res.status(400).json({ mes: 'Email is Already Exist', status: 0 });
        }
    }
    catch (err) {
        return res.status(400).json({ mes: 'Somthing wrong', status: 0 });
    }
}
//login manager profile
module.exports.Loginmanager = async (req, res) => {
    try {
        let chakmanageremail = await Manager.findOne({ email: req.body.email });
       
        if (chakmanageremail) {
            if (await bcrypt.compare(req.body.password, chakmanageremail.password)) {
                let token = await jwtDAta.sign({ ManagerData: chakmanageremail }, 'Manager', { expiresIn: '1h' });
                return res.status(200).json({ mes: 'Manager Login is success', status: 1, record: token });
            }
            else {
                return res.status(200).json({ mes: 'invalid password', status: 0 });
            }
        }
        else {
            return res.status(200).json({ mes: 'invalid email', status: 0 });
        }
    }
    catch (err) {
        return res.status(400).json({ mes: 'Somthing wrong', status: 0 });
    }
}
//view manager profile
module.exports.mangerprofile = async(req,res)=>{
    try{
        let managerprofile = await Manager.findById(req.user.id).populate('adminIds').exec();
        return res.status(200).json({ mes: 'Manager data is hear', status: 1, md: managerprofile }); 
    }
    catch (err) {
        return res.status(400).json({ mes: 'Somthing wrong', status: 0 });
    }
}
//edit manager profmanagerile
module.exports.editmanager = async(req,res)=>{
    try {
        // console.log(req.file);
        // console.log(req.params.id);
        if (req.file) {
            let oldImg = await Manager.findById(req.params.id);
            console.log(oldImg);
            if (oldImg.image) {
                let fullPath = path.join(__dirname, "../../../..", oldImg.image);
                console.log(fullPath);
                await fs.unlinkSync(fullPath);
            }
            var imgPath = '';
            imgPath = Manager.imagePath + "/" + req.file.filename;
            req.body.image = imgPath;
        }
        else {
            let olddata = await Manager.findById(req.params.id);
            var imgpath = '';
            if (olddata) {
                imgpath = olddata.image;
            }
            req.body.image = imgpath;
        }
        let Managerupdated = await Manager.findByIdAndUpdate(req.params.id, req.body);
        if (Managerupdated) {
            let updateprofile = await Manager.find({})
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
//view all user data
module.exports.getallUser = async(req,res)=>{
    try{
        let allUserdata = await User.find({});
        if(allUserdata){
            return res.status(200).json({ mes: 'view all User data by manager', status: 1, ur: allUserdata });
        }
        else{
            return res.status(200).json({ mes: 'User data is not found', status: 0});
        }
    }
    catch (err) {
        return res.status(400).json({ mes: 'Somthing wrong', status: 0 });
    }

}