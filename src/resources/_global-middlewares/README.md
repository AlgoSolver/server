# Global
this directory contain all global middlewares tha all this routes use such as:

1- check-auth --> this middleware is used to check that is the user who send the request is logged in or not by attach objet called auth in req, if the user not logged the req.auth will equal {notAuth:true} otherwise will contain user info

2- restrict-auth --> this middleware is prevent a non logged user to move in to this pass 