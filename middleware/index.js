// All the middleware goes here
var Hotel = require("../models/hotel")
var Comment = require("../models/comment")
var flash = require("connect-flash");

var middlewareObj = {};

middlewareObj.checkHotelOwnership = function(req, res, next) {
    if (req.isAuthenticated()) {
        Hotel.findById(req.params.id, function(err, foundHotel) {
            //Does the user own the campground

            if (err) {

                res.redirect("back");
            }
            else {

                // Does user own the campground?

                if (foundHotel.author.id.equals(req.user._id)) {

                    next();
                }
                else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }

            }
        });


    }
    else {
        req.flash("error", "You need to be logged in to do that!");
        res.redirect("back");
    }
};


middlewareObj.checkCommentOwnership = function(req, res, next) {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function(err, foundComment) {

            //Does the user own the comment

            if (err) {
                res.redirect("back");
            }
            else {

                // Does user own the comment?

                if (foundComment.author.id.equals(req.user._id)) {
                    next();
                }
                else {
                    req.flash("error", "You don't have permission to do that!");
                    res.redirect("back");
                }

            }
        });


    }
    else {
        req.flash("error", "You need to be logged in to do that!");
        res.redirect("back");
    }
};

middlewareObj.isLoggedIn = function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that!");
    res.redirect("/login");
}



module.exports = middlewareObj;
