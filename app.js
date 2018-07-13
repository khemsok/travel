require("dotenv").config();

var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    Hotel = require("./models/hotel"),
    seedDB = require("./seeds"),
    Comment = require("./models/comment"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    User = require("./models/user"),
    methodOverride = require("method-override"),
    flash = require("connect-flash");

// Requiring routes

var commentRoutes = require("./routes/comments"),
    hotelRoutes = require("./routes/hotels"),
    indexRoutes = require("./routes/index");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
// mongoose.connect('mongodb://ace:password1@ds235431.mlab.com:35431/travelwithme', { useNewUrlParser: true });
// mongoose.connect("mongodb://localhost:27017/travel", { useNewUrlParser: true });
mongoose.connect("mongodb://ace:password1@ds235431.mlab.com:35431/travelwithme", { useNewUrlParser: true });


app.use(methodOverride("_method"));
app.locals.moment = require('moment');
app.use(flash());

// seedDB();

// PASSPORT CONFIGURATION

app.use(require("express-session")({
    secret: "Ace is cool",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use(indexRoutes);
app.use("/hotels", hotelRoutes);
app.use("/hotels/:id/comments",commentRoutes);

app.listen(3000, function() {
    console.log("Server has started");
});




