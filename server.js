let express=require("express");
let path=require("path");
let mongoose=require("mongoose");
let connect_flash=require("connect-flash");
let authRouter=require("./Routers/authrouter");
let speakerRouter=require("./Routers/speakerrouter");
let adminRouter=require("./Routers/adminRouter");
let auto = require("mongoose-auto-increment");
let encrypt =require("mongoose-bcrypt");
let eventRouter=require("./Routers/eventsRouter");
let express_session=require("express-session");
let moment = require('moment');
let multer = require('multer');
mongoose.connect('mongodb://localhost:27017/speakers', {useNewUrlParser: true})
.then(()=>{
console.log("DB connected....");
})
.catch((error)=>{
    console.log(error+"");
});
multer=multer({
    dest:"./public/images"
  });

//open the server using express
const server=express();

server.listen(8083,()=>{
    console.log("I am listening on 8083....");
});
//// Settings
server.use(express.urlencoded({extended:true}));
server.use(express.static(path.join(__dirname,"public")));

server.use(express.static(path.join(__dirname,"node_modules")));
server.use(express_session({
    secret:"sss",
    resave:true,
    saveUninitialized:true

}));
server.use(connect_flash());
server.set("view engine","ejs");
server.set("views" ,path.join(__dirname,"views"));
//middleware  --> print url, method
server.use(function(request,response,next){
    console.log(request.method + ":"+request.url);
    next();
});

server.use(authRouter);
server.use((request, response, next) => {
    if (request.session.role)
        next();
    else
        response.redirect("/login");
});
server.use("/speakers",speakerRouter);
server.use(adminRouter);
server.use("/events",eventRouter);
server.use((request,response)=>{
    response.send("Sorry ^_^............");
});