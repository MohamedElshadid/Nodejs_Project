const express=require("express");
const mongoose=require("mongoose");
const adminRouter=express.Router();
require("../Models/speakerModel");
let adminModels=mongoose.model("speakers");
adminRouter.use((request,response,next)=>{
  if(request.session.role == "admin")
  {
    
    adminRouter.get("/admin/profile", (request, response) => {
      adminModels.findById(request.session._id).then((data) => {
        response.locals.Name = request.session.name;
          //console.log(request.session._id);
      response.render("admin/adminProfile",{profile : data});
         
      }).catch((err) => {
          console.log(err);
      })
  });
  adminRouter.get("/admin/updateProfile/:_id",(request,response)=>{
    adminModels.findOne({_id: request.params._id })
    .then((data)=>{
        response.locals.Name = request.session.name;
        response.render("admin/Update",{profile:data});
        //response.send(data);
    })
    .catch((error)=>{
        console.log(error+"");
    });
    
    
    
});//update
adminRouter.post("/admin/updateProfile",(request,response)=>{
    adminModels.updateOne({_id:request.session._id}, { $set:request.body}).then((date)=>{
        //console.log(data);
        //response.send(data)
        // console.log(data);
        response.redirect("/admin/profile"); 
        
    }).catch((error)=>{
        console.log(error+"");
    })
});//update
      next();
  }
  else
      response.redirect("/login");
});
module.exports=adminRouter;