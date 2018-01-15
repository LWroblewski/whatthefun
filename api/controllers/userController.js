
const service = require("../services/UserService")();



exports.authenticate = function(req, res){
	if(req.headers.authorization){
		const b64 = req.headers.authorization.substring(6);
		const buf = Buffer.from(b64, 'base64');
		
		const creds = buf.toString("utf-8").split(":");
		console.log(creds);
		const login = service.getJwt({login:creds[0], pwd:creds[1]});
		res.json(login);
	}
	res.status(401);
}

exports.getAllUsers = function(req, res){
	console.log("Get all users");
	User.find({}, function(err, user){
		if(err){
			res.send(err);
		}
		res.json(user);
	});
};

exports.createUser = function(req, res){
	console.log("Create user");
	const newUser = new User(req.body);
	newUser.save(function(err, user){
		if(err){
			res.send(err);
		}
		res.json(user);
	});
};

exports.getUser = function(req, res){
	console.log("Get user");
	//...findById({req.params.userId} ...
	User.findOne({login : req.params.userId}, function(err, user){
		if(err){
			res.send(err);
		}
		res.json(user);
	});
};

exports.updateUser = function(req, res){
	console.log("Update user");
	User.findOneAndUpdate({login:req.params.userId}, req.body, {new:true}, function(err, user){
		if(err){
			res.send(err);
		}
		res.json(user);
	});
};

exports.deleteUser = function(req, res){
	console.log("Delete user");
	User.remove({_id:req.params.userId}, function(err, user){
		if(err){
			res.send(err);
		}
		res.json({message:'User successfully deleted'});
	});
};