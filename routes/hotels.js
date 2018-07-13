var express = require("express");
var router = express.Router();
var Hotel = require("../models/hotel");
var middleware = require("../middleware");

var NodeGeocoder = require('node-geocoder');
 
var options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};
 
var geocoder = NodeGeocoder(options);



router.get("/", function(req, res) {
    Hotel.find({}, function(err, allHotels) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("hotels/index", {
                hotels: allHotels
            });
        }
    });


});


//CREATE - add new hotel to DB
router.post("/", middleware.isLoggedIn, function(req, res){
  // get data from form and add to hotels array
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.desc;
  var price = req.body.price;
  var author = {
      id: req.user._id,
      username: req.user.username
  }
  geocoder.geocode(req.body.location, function (err, data) {
    if (err || !data.length) {
      req.flash('error', 'Invalid address');
      return res.redirect('back');
    }
    var lat = data[0].latitude;
    var lng = data[0].longitude;
    var location = data[0].formattedAddress;
    var newHotel = {name: name, price: price, image: image, description: desc, author:author, location: location, lat: lat, lng: lng};
    // Create a new hotel and save to DB
    Hotel.create(newHotel, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to hotels page
            console.log(newlyCreated);
            res.redirect("/hotels");
        }
    });
  });
});

router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("hotels/new");
});

router.get("/:id", function(req, res) {

    Hotel.findById(req.params.id).populate("comments").exec(function(err, el) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("hotels/show", { hotel: el });
        }
    });
});



// EDIT ROUTE

router.get("/:id/edit", middleware.checkHotelOwnership, function(req, res) {
    // Check if user is logged in

        Hotel.findById(req.params.id, function(err, foundHotel) {
                    res.render("hotels/edit", { hotel: foundHotel });
                });
});


// UPDATE ROUTE

// UPDATE hotel ROUTE
router.put("/:id", middleware.checkHotelOwnership, function(req, res){
  geocoder.geocode(req.body.location, function (err, data) {
    if (err || !data.length) {
      req.flash('error', 'Invalid address');
      return res.redirect('back');
    }
    req.body.hotel.lat = data[0].latitude;
    req.body.hotel.lng = data[0].longitude;
    req.body.hotel.location = data[0].formattedAddress;

    Hotel.findByIdAndUpdate(req.params.id, req.body.hotel, function(err, hotel){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            req.flash("success","Successfully Updated!");
            res.redirect("/hotels/" + hotel._id);
        }
    });
  });
});
// DELETE hotel

router.delete("/:id", middleware.checkHotelOwnership, function(req, res) {
    Hotel.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            console.log(err);
        }
        else {
            req.flash("success", "Hotel deleted")
            res.redirect("/hotels");
        }
    });
});


module.exports = router;
