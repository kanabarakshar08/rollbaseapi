const User = require("../../../../models/User/User")
const bcrypt = require("bcrypt");
const jwtDAta = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');

// user data view and send email to user email id
module.exports.addUser = async(req,res)=>{
  try{
    console.log(req.file);
    let chakemail = await User.findOne({email:req.body.email});
    if(!chakemail){
        
        if(req.body.confirm_pass == req.body.password){
           let imgpath = '';
           if(req.file){
               imgpath =  User.imagePath + "/" + req.file.filename;
              
           }
           req.body.image = imgpath;
           console.log(req.file)
           console.log(req.imagePath)
           
           req.body.password = await bcrypt.hash(req.body.password, 10);
           let userdata = await User.create(req.body);
           if(userdata){
             return res.status(200).json({ mes: 'User data Insert', status: 1});
           }
           else{
             return res.status(200).json({ mes: 'User data not found', status: 0 });
           }
        }
        else{
          return res.status(200).json({ mes: 'Password is not match to conform password', status: 0 });
        }
    }
    else {
      return res.status(400).json({ mes: 'Email is Already Exist', status: 0 });
    }
  }

  catch(err){
    return res.status(400).json({ mes: 'Somthing wrong', status: 0 });
  }
}
//login user with token 
module.exports.UserLogin = async(req,res)=>{
   try{
     let chakUserMail = await User.findOne({email:req.body.email});
     if(chakUserMail){
        if(await bcrypt.compare(req.body.password, chakUserMail.password)){
          let token = await jwtDAta.sign({ userecord:chakUserMail },'User',{expiresIn:'1h'});
          return res.status(200).json({ mes: 'User Login is success', status: 1, record: token });
        }
        else{
          return res.status(400).json({ mes: 'Password is Invalid', status: 0 });
        }
     }
     else{
      return res.status(400).json({ mes: 'Email is Invalid', status: 0 });
     }
   }
   catch(err){
    return res.status(400).json({ mes: 'Somthing wrong', status: 0 });
  }
}
//view user profile with token
module.exports.userprofile = async(req,res)=>{
  try{
      return res.status(200).json({ mes: 'User data is hear', status: 1, md: req.user }); 
  }
  catch (err) {
      return res.status(400).json({ mes: 'Somthing wrong', status: 0 });
  }
}
// view user profile
module.exports.editUser = async(req,res)=>{
  try {
      // console.log(req.file);
      // console.log(req.params.id);
      if (req.file) {
          let oldImg = await User.findById(req.params.id);
          console.log(oldImg);
          if (oldImg.image) {
              let fullPath = path.join(__dirname, "../../../..", oldImg.image);
              console.log(fullPath);
              await fs.unlinkSync(fullPath);
          }
          var imgPath = '';
          imgPath = User.imagePath + "/" + req.file.filename;
          req.body.image = imgPath;
      }
      else {
          let olddata = await User.findById(req.params.id);
          var imgpath = '';
          if (olddata) {
              imgpath = olddata.image;
          }
          req.body.image = imgpath;
      }
      let Userupdated = await User.findByIdAndUpdate(req.params.id, req.body);
      if (Userupdated) {
          let updateprofile = await User.find({})
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