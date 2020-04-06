const express=require("express");
const mongoose=require("mongoose");
const eventRouter=express.Router();
let moment = require("moment");
require("../Models/eventModel");
let eventModels=mongoose.model("events");
require("../Models/speakerModel");
let speakerModels=mongoose.model("speakers");
eventRouter.use((request,response,next) =>{
  if(request.session.role == "admin")
  {
      next();
  }
  else
  {
    request.flash("msg","You Are not allowed Its only for Admin");
    response.redirect("/login");

  }
})
eventRouter.get("/list",(request,response)=>{
    eventModels.find({}).populate({path:"mainSpeaker otherSpeakers"})
    
    .then((data)=>{
        response.locals.Name = request.session.name;
        response.render("events/listevent",{event:data})
        //response.send(data);
        console.log(data)
    })
    .catch((error)=>{
        console.log(error+"");
    });
});//list
eventRouter.get("/add",(request,response,speeaker)=>{
    speakerModels.find({})
    
    .then((data)=>{
        response.locals.Name = request.session.name;
        response.render("events/addevent",{speaker:data});
        response.render("events/listevent",{event:data})
        response.send(data);
        console.log(data)
    })
    .catch((error)=>{
        console.log(error+"");
    });
       

    
});//add
eventRouter.post("/add",(request,response)=>{
    let event =new eventModels(request.body);
    event.save().then((data)=>{
        console.log(data);
        response.redirect("/events/list");
    })
    .catch((error)=>{
        console.log(error+"");
    })
});//add
eventRouter.get("/delete/:_id",(request,response)=>{
    eventModels.findByIdAndDelete({ _id: request.params._id }).then((date)=>{
        //console.log(data);
        response.send(request.params._id); 
    }).catch((error)=>{
        console.log(error+"");
    })
});//delete

eventRouter.get("/update/:_id",(request,response,event)=>{
    eventModels.findOne({_id: request.params._id }).populate({path : "mainSpeaker otherSpeakers"})
    .then((data)=>{
        speakerModels.find({}).then((speakers) =>{
            response.render("events/editEvents",{event:data,speakers : speakers,moment: moment});
        }).catch((err) =>{
            console.log(err);
        });
        console.log(data);
        
    })
    .catch((error)=>{
        console.log(error+"");
    });
});//update
eventRouter.post("/update",(request,response)=>{
    eventModels.updateOne({_id:request.body._id}, { $set: request.body }).then((date)=>{
        //console.log(request.body._id);
        response.redirect("/events/list");
    }).catch((error)=>{
        console.log(error+"");
    }) 
});//update

module.exports=eventRouter;