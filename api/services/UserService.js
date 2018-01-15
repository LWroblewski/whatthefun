const mongoose = require("mongoose");
const User = mongoose.model("Users");


module.exports = function(){
	const priv = "private var";
	return {
		getJwt : function(creds){
			console.log("Creds Login :"+creds.login);
			return priv;
		}
	}
	
}