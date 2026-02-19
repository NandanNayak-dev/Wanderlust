module.exports.isLoggedIn=(req,res,next)=>{
    
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;

        req.flash("error","You must be logged in to do that");
        return res.redirect("/login");
    }
    next();
}
//This middleware checks if the user is authenticated using Passport's req.isAuthenticated() method.
//  If the user is not authenticated, it saves the original URL they were trying to access in the session (so we can redirect them back after login),
//  flashes an error message, and redirects them to the login page. 
// If the user is authenticated, it simply calls next() to proceed to the next middleware or route handler.
module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        console.log(req.session.redirectUrl);
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}