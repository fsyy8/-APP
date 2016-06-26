var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/lolapp");

mongoose.connection.on("error", function (error){
    console.log("连接数据库失败"+error);
});

mongoose.connection.on("open", function (){
    console.log("数据库连接成功！！！");
});

var tschema = new mongoose.Schema({
    name  : { type:String },
    date : {type: Date, default: Date.now}
});

var tmodel = mongoose.model("tdoc", tschema);

var testEntity = new tmodel({    name: "testUser"});testEntity.save(function (error, doc){    if(error){        console.log("error: "+error);    }else{        console.log(doc);    }});

tmodel.find({}, function (error, docs){
    if(error){
        console.log("error: "+error);
    }else{
        console.log(docs);
    }
});

exports.mongoose = mongoose;