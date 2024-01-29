const express = require('express');
const routes = express.Router();
const mangerController = require("../../../../Controller/API/V1/Mangere/ManagerController");
const Manager = require("../../../../models/Manager/Manager");
const passport = require('passport');


routes.post("/add_manager",passport.authenticate('jwt',{failureRedirect:"/admin/manager/faillogin"}),Manager.uploadImage,mangerController.add_manager);
routes.get("/faillogin",async(req,res)=>{
    return res.status(400).json({ mes: 'login failed', status: 0 });
})
routes.post("/Loginmanager",mangerController.Loginmanager);
routes.put("/editmanager/:id",passport.authenticate('manager',{failureRedirect:"/admin//manager/managerfaillogin"}),Manager.uploadImage,mangerController.editmanager);
routes.get("/mangerprofile",passport.authenticate('manager',{failureRedirect:"/admin/manager/managerfaillogin"}),mangerController.mangerprofile);

routes.get("/managerfaillogin",async(req,res)=>{
    return res.status(400).json({ mes: 'manager login failed', status: 0 });
})
//view all user data
routes.get("/getallUser",passport.authenticate('manager',{failureRedirect:"/admin/manager/Userfaillogin"}),mangerController.getallUser);
routes.get("/Userfaillogin",async(req,res)=>{
    return res.status(400).json({ mes: 'User data is not found', status: 0 });
})

module.exports = routes