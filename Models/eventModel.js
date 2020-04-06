mongoose = require("mongoose");
let auto = require("mongoose-auto-increment");
eventSchema= new mongoose.Schema({
    title:{ type: String, required: true},
    eventData:Date,
    mainSpeaker:{type:Number,ref:"speakers"},
    otherSpeakers:[{type:Number,ref:"speakers"}]
});
auto.initialize(mongoose.connection);
eventSchema.plugin(auto.plugin,"events");
mongoose.model("events",eventSchema);
