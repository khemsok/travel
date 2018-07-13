var mongoose = require("mongoose");
var Hotel = require("./models/hotel");
var Comment = require("./models/comment");


var data = [{
        name: "Cloud's Rest",
        image: "https://images.pexels.com/photos/699558/pexels-photo-699558.jpeg?auto=compress&cs=tinysrgb&h=350",
        description: "Blah Blah Blah"
    },
    {
        name: "Desert Mesa",
        image: "https://recreation-acm.activefederal.com/assetfactory.aspx?did=5221",
        description: "Blah Blah Blah"
    },
    {
        name: "Canyon Floor",
        image: "https://s3-us-west-2.amazonaws.com/hispotion-prod/wp-content/uploads/2017/05/31-05101657f53d1a399b7051016886742565-31.jpg",
        description: "Blah Blah Blah"
    }
];


function seedDB() {
    Hotel.remove({}, function(err) {
        // if (err) {
        //     console.log(err);

        // }
        // else {
        //     console.log("removed hotels!");
        //     data.forEach(function(seed) {
        //         Hotel.create(seed, function(err, el) {
        //             if (err) {
        //                 console.log(err);
        //             }
        //             else {
        //                 console.log("added a hotel");
        //                 Comment.create({
        //                     text: "This place is great, but I wish there was internet",
        //                     author: "Homer"
        //                 }, function(err, comment) {
        //                     if (err) {
        //                         console.log(err);
        //                     }
        //                     else {
        //                         el.comments.push(comment);
        //                         el.save();
        //                         console.log("added new comment");
        //                     }

        //                 });
        //             }
        //         });
        //     });
        // }
    });

}

module.exports = seedDB;
