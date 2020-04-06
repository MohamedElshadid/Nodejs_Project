const express=require("express");
mongoose = require("mongoose");
let path=require("path");
const authRouter=express.Router();
require("../Models/speakerModel");
let speakerModels=mongoose.model("speakers");


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
authRouter.post("/register",(request,response)=>{
    speakerModels.findOne({name:request.body.name}).then((data)=>{
        let exists =false;
        if((request.body.password,123)||(request.body.password,data.password)){
            exists=true;
        }
        if(data != null)
        {
            if((data.name==request.body.name)&&exists)
            {   
                request.flash("msg","Plz Enter another Name");
                response.redirect("/login");
                
            }
        } else {
            let speaker =new speakerModels(request.body);
            speaker.save().then((data)=>{
                response.redirect("/login");
            })
            .catch((error)=>{
                console.log(error+"");
            })
            
            
        }
    })
    .catch((error)=>{
        console.log(error+"")

    })
});
authRouter.get("/logout",(request,response)=>{
    request.session.destroy(()=>
    {
      response.redirect("/login");
    })
});


module.exports=authRouter;



//res.redirect('/login');