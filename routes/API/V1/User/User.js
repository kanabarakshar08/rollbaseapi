const express = require("express");
const routes = express.Router();
const UserContoller = require("../../../../Controller/API/V1/User/UserCOntroller");
const User = require("../../../../models/User/User");
const passport = require("passport");

routes.post("/addUser",User.uploadImage,UserContoller.addUser);
routes.post("/UserLogin",UserContoller.UserLogin);
routes.get("/userprofile",passport.authenticate('user',{failureRedirect:"/admin/User/Userfaillogin"}),UserContoller.userprofile);
routes.put("/editUser/:id",passport.authenticate('user',{failureRedirect:"/admin/User/Userfaillogin"}),User.uploadImage,UserContoller.editUser);
routes.get("/Userfaillogin",async(req,res)=>{
    return res.status(400).json({ mes: "User login failed", status: 0 });
})
module.exports = routes;