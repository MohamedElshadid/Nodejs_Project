mongoose = require("mongoose");
let auto = require("mongoose-auto-increment");
speakerSchema= new mongoose.Schema({
    name:String,
    age:Number,
    password:{ type: String,  bcrypt: true },
    image:{ data: Buffer, contentType: String,name:String },
    address:{
        city:String,
        street:Number,
        building:Number
    }
});
auto.initialize(mongoose.connection);
speakerSchema.plugin(auto.plugin,"speakers");
mongoose.model("speakers",speakerSchema);

// speakerSchema.plugin(require('mongoose-bcrypt'));
