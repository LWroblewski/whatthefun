# What The Fun - Backend  

# Still ongoing 

Routes :

GET /login -> 
  Authenticates the user with the login:password encoded as Basic64 & sent through the Authorization header. 
  Returns a json web token needed to user the restricted routes. 
  

Authenticated Routes : Needs a Authorization : Bearer {jwt} header 

GET /api/users -> Returns the list of all users
GET /api/users/:userId -> Returns user informations
PUT /api/users/:userId -> Update user
GET /api/teams -> Returns the list of teams
GET /api/events -> Returns the list of events
POST /api/events -> creates an event
GET /api/events/:eventId -> returns the informations of the event
POST /api/events/:eventId/comments -> adds a comment on the event
POST /api/events/:eventId/likes -> adds a like on the event

Admin Routes : Needs a jwt that authenticate a user with admin rights

POST /api/users -> Creates an user
DELETE /api/users/:userId -> Deletes the user
POST /api/teams -> Creates a team
