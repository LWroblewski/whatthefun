const mock = require('./mock');

exports.getAllUsers = function(req, res){
  res.json(mock.users);
}

exports.createUser = function(req, res){
  try{
    mock.users.push(req.body);
    res.status(201).end();
  }catch(e){
    res.status(500).send("An error occured");
  }
}

exports.getUser = function(req, res){
  for(let i=0; i<mock.users.length; i++){
    if(mock.users[i].login===req.params.userId){
      res.json(mock.users[i]);
      break;
    }
    res.send(req.params.userId +" not found");
  }
}

// exports.updateUser = function(req, res){
//   res.json(mock.users);
// }
// exports.deleteUser = function(req, res){
//   res.json(mock.users);
// }
