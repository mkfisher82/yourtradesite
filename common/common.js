exports.isAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) {
        console.log('Authentication Successful')
        return next();
    }
    
    res.redirect('/login');
}
