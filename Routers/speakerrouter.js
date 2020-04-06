const express=require("express");
const mongoose=require("mongoose");
const speakerRouter=express.Router();
require("../Models/speakerModel");
require("../Models/eventModel");
let eventModels=mongoose.model("events");
let speakerModels=mongoose.model("speakers");
multer = require("multer");
let fs = require('fs');
let multerMW = multer({
    dest: "./public/images"
});

speakerRouter.use((request,response,next)=>
{
  if(request.session.role == "admin")
  {
    speakerRouter.get("/list",(request,response)=>{
        speakerModels.find({})
        .then((data)=>{
            response.locals.Name = request.session.name;
            response.render("speakers/listSpeakers",{speaker:data});   
            //response.send(data)
        })
        .catch((error)=>{
            console.log(error+"");
        });
    });//list
    speakerRouter.get("/add",(request,response)=>{
        response.locals.Name = request.session.name;
        response.render("speakers/addspeakers");
        
    });//add
    speakerRouter.post("/add",multerMW.single("image"),(request,response)=>{
        let speaker =new speakerModels({
            "name": request.body.name,
            "age": request.body.age,
            "password": request.body.password,
            "address.city": request.body.city,
            "address.street": request.body.street,
            "address.building": request.body.building,
            image: { name: request.file.filename }
            
        });
        speaker.save().then((data)=>{
            console.log(data);
            response.redirect("/speakers/list");
        })
        .catch((error)=>{
            console.log(error+"");
        })
    });//add
    speakerRouter.get("/delete/:_id",(request,response)=>{
        speakerModels.deleteOne({ _id: request.params._id }).then((date)=>{
            response.send(request.params._id); 
            // console.log(data);
        }).catch((error)=>{
            console.log(error+"");
        })
    });//delete
    speakerRouter.get("/update/:_id",(request,response)=>{
        speakerModels.findOne({_id: request.params._id })
        .then((data)=>{
            response.locals.Name = request.session.name;
            response.render("speakers/editSpeakers",{profile:data});
            //response.send(data);
        })
        .catch((error)=>{
            console.log(error+"");
        });
        
        
        
    });//update
    speakerRouter.post("/update",multerMW.single("image"),(request,response)=>{
        speakerModels.updateOne({name:request.body.name}, { $set:request.body}).then((date)=>{
            response.locals.Name = request.session.name;
            response.redirect("/speakers/list"); 
        }).catch((error)=>{
            console.log(error+"");
        })
    });//update
      next();
  }else if (request.session.role == "speaker") {
    speakerRouter.get("/profile", (request, response) => {
        //console.log(request.session._id);
        speakerModels.findById(request.session._id).then((data) => {
            response.locals.Name = request.session.name;
            console.log(request.session._id);
        response.render("speakers/speakersProfile",{profile : data});
           
        }).catch((err) => {
            console.log(err);
        })
    });//profile
    //  speakerRouter.post("/profile",(request,response)=>{
    //      response.redirect("/speakers/list");
    //  });
    speakerRouter.get("/updateProfile/:_id",(request,response)=>{
        speakerModels.findOne({_id: request.params._id })
        .then((data)=>{
            response.locals.Name = request.session.name;
            response.render("speakers/Update",{profile:data});
            //response.send(data);
        })
        .catch((error)=>{
            console.log(error+"");
        });
        
        
        
    });//update
    speakerRouter.post("/updateProfile",(request,response)=>{
        speakerModels.updateOne({_id:request.session._id}, { $set:request.body}).then((date)=>{
            response.redirect("/speakers/profile"); 
            
        }).catch((error)=>{
            console.log(error+"");
        })
    });//update
    speakerRouter.get("/showEvent",(request,response,event)=>{
        eventModels.find({}).populate({path : "mainSpeaker otherSpeakers"}).then((data) =>{
            response.locals.Name = request.session.name;
            console.log(response.locals.Name);
            response.render("speakers/myEvent",{event :data});
            response.send(data);
        }).catch((err) =>{
            console.log(err);
        })
    })
    next();
  }
  else
  {
    request.flash("msg","You Are not allowed Its only for Admin");

      response.redirect("/login");
  }

})

module.exports=speakerRouter;