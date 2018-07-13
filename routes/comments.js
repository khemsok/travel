var express = require("express");
var router = express.Router({mergeParams: true});
var Hotel = require("../models/hotel");
var Comment = require("../models/comment");
var middleware = require("../middleware")

// Comments New

router.get("/new",middleware.isLoggedIn, function(req,res){
    Hotel.findById(req.params.id, function(err, el){
        if(err){
            req.flash("error", "Something went wrong");
            console.log(err);
        }
        else{
            res.render("comments/new", {hotel: el});
        }
    });
});

// Comments Create

router.post("/",middleware.isLoggedIn, function(req,res){
    Hotel.findById(req.params.id, function(err, hotel){
        if(err){
            console.log(err);
            res.redirect("/hotels");
        }else{
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    req.flash("error", "Something went wrong");
                    console.log(err);
                }else{
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    hotel.comments.push(comment);
                    hotel.save();
                    req.flash("success", "Successfully added comment");
                    res.redirect("/hotels/"+hotel._id);

                }
            });
        }
    });
});


// Edit Comment -- SHOW ROUTES

router.get("/:comment_id/edit",middleware.checkCommentOwnership, function(req,res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.resdirect("back");
        }else{
            console.log(foundComment);
             res.render("comments/edit", {hotel_id: req.params.id, comment: foundComment})  ;
        }
    });

});

// Edit Comment -- UPDATE ROUTES

router.put("/:comment_id", middleware.checkCommentOwnership,function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err,foundComment){
        if(err){
            res.redirect("back");
        }else{
            res.redirect("/hotels/"+req.params.id);
        }
    });
});


// Delete Comment

router.delete("/:comment_id",middleware.checkCommentOwnership, function(req,res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        }
        else{
            req.flash("success", "Comment deleted");
            res.redirect("/hotels/"+req.params.id);
        }
    });
});


module.exports = router;