const express = require('express')

const routes = express.Router();

const register = require('../../../../models/ADMIN/register');
const AdminController = require('../../../../Controller/API/V1/ADMIN/adminController');
const passport =require("passport");

routes.post("/register" ,register.uploadImage, AdminController.register)
routes.post("/login", AdminController.login);
routes.get("/alladminrecord",passport.authenticate('jwt',{failureRedirect:"/admin/faillogin"}),AdminController.alladminrecord);
routes.get("/faillogin",async(req,res)=>{
    return res.status(400).json({ mes: 'login failed', status: 0 });
})
routes.get("/adminprofile",passport.authenticate('jwt',{failureRedirect:"/admin/faillogin"}),AdminController.adminprofile);
routes.put("/editadmin/:id",passport.authenticate('jwt',{failureRedirect:"/admin/faillogin"}),register.uploadImage,AdminController.editadmin);

//manager data view in admin
routes.get("/getallmanager",passport.authenticate('jwt',{failureRedirect:"/admin/managerfaillogin"}),AdminController.getallmanager);
routes.get("/managerfaillogin",async(req,res)=>{
    return res.status(400).json({ mes: 'manager data is not found', status: 0 });
})
//user data view in admin 
routes.get("/getallUser",passport.authenticate('jwt',{failureRedirect:"/admin/Userfaillogin"}),AdminController.getallUser);
routes.get("/Userfaillogin",async(req,res)=>{
    return res.status(400).json({ mes: 'User data is not found', status: 0 });
})
//manager rotuing file
routes.use("/manager",require("../Manger/Manger"));  
routes.use("/User",require("../User/User"));
module.exports = routes;