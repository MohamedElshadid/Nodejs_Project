const express=require("express");
mongoose = require("mongoose");
let path=require("path");
const authRouter=express.Router();
const gravatar = require('gravatar');
require("../Models/speakerModel");
const bcrypt = require('bcryptjs');
let speakerModels=mongoose.model("speakers");
multer = require("multer");
let fs = require('fs');
let multerMW = multer({
    dest: "./public/images"
});


authRouter.get("/login",(request,response)=>{
    // response.sendFile(path.join(__dirname,"..","./","Views","Home.html"));
    response.render("auth/login",{msg:request.flash("msg")});
     //response.send("/login, get");
});
authRouter.post("/login",(request,response)=>{
    speakerModels.findOne({name:request.body.name}).then((data)=>{
        let exists =false;
        if((request.body.password==data.password)){
            exists=true;
        }
        if(data != null)
        {
            
            if((data.name=="Mohamed")&&(request.body.password=="123"))
            {
                
                request.session._id = data._id;
                request.session.role = "admin";
                request.session.name = data.name;
                response.locals.Name = request.session.name;
                response.redirect("/admin/profile");
        
            } else
            {
                speakerModels.findOne(request.body).then((data) =>{
                    if(data){
                        console.log(data.password);
                        request.session._id = data._id;
                        request.session.name = data.name;
                        response.locals.Name = request.session.name;
                        request.session.role = "speaker";
                        response.redirect("/speakers/profile");
                    } else{
                        request.flash("msg","username or password is not correct ");
                        response.redirect("/login");
                    }
                }).catch((error)=>{
                    console.log(error);
                });

            }
        }
    })
    .catch((error)=>{
        console.log(error+"")
        
    })

});
// authRouter.get("/admin/profile",(request,response)=>{response.send("/admin/profile")});
authRouter.get("/register",(request,response)=>{
    response.render("auth/register");
});
authRouter.post("/register",multerMW.single("image"),async (request,response)=>{
    const password = request.body.password;
    const name = request.body.name;

    try {
            const avatar = gravatar.url(name, {
                s: '200',
                r: 'pg',
                d: 'mm'
            })
 
            let speaker2 =new speakerModels({
                name,
                "age": request.body.age,
                password,
                avatar,
                "address.city": request.body.city,
                "address.street": request.body.street,
                "address.building": request.body.building,
                
            });
    
            const salt = await bcrypt.genSalt(10);
    
            speaker2.password = await bcrypt.hash(password, salt);
    
            await speaker2.save();
            response.redirect("/login");

    } catch(err) {

        console.error(err.message);
    }
    
        

});
authRouter.get("/logout",(request,response)=>{
    request.session.destroy(()=>
    {
      response.redirect("/login");
    })
});


module.exports=authRouter;



//res.redirect('/login');