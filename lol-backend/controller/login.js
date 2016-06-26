var userModel = require("../models/usermodel").userList;

exports.login = function(req,res){
	userModel.findOne({username: req.body.username},function(err,doc){
		if(!err && doc && req.body.password == doc.password){
			res.send({
				code: 200,
				msg: "成功"
			});
		}
	});
};