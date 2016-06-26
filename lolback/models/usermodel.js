var mongodb = require("./index");
var Schema = mongodb.mongoose.Schema;

var registerSchema = new Schema({
    username: {type: String},
    password: {type: String},
    servername: {type: String},
    playername: {type: String},
    token: {type: String},
});
var userModel = mongodb.mongoose.model("user", registerSchema);
exports.userList = userModel;
