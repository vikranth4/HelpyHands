var express = require("express");
var router = express.Router();
var Review = require("../models/review");


isLoggedIn = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You need to Login to give your feedback");
    res.redirect("/login");
}


// Reviews Index
router.get("/reviews", isLoggedIn, function (req, res) {
    options: { sort: { createdAt: -1 } } // sorting the populated reviews array to show the latest first
    Review.find({}, function (err, allReviews) {
        if (err) {
            req.flash("error", "You need to login to give your feedback");
            res.redirect("/login");
        }
        else {
            allReviews.rating = calculateAverage(allReviews);

            res.render("review/index", { currentUser: req.user, reviews: allReviews });
        }
    });
});


// Reviews New
router.get("/reviews/new", isLoggedIn, function (req, res) {

    Review.find({}, function (err, reviews) {
        if (err) {
            req.flash("error", err.message);
            return res.redirect("back");
        }
        res.render("review/new", { reviews: reviews });

    });
});


// Reviews Create
router.post("/reviews", isLoggedIn, function (req, res) {
    //lookup campground using ID

    Review.create(req.body.review, function (err, review) {
        if (err) {
            req.flash("error", err.message);
            return res.redirect("back");
        }
        //add author username
        review.author.id = req.user._id;
        review.author.username = req.user.username;

        //save review
        review.save();
        req.flash("success", "Your review has been sucecssfully added")
        res.redirect('/reviews');
    });

});

// Reviews Edit
router.get("/reviews/:id/edit", isLoggedIn, function (req, res) {
    Review.findById(req.params.id, function (err, foundReview) {
        if (err) {
            req.flash("error", err.message);
            res.redirect("back");
        }
        else {
            res.render("review/edit", { review: foundReview });
        }

    });
});

// Reviews Update
router.put("/reviews/:review_id", isLoggedIn, function (req, res) {
    Review.findByIdAndUpdate(req.params.review_id, req.body.review, { new: true }, function (err, updatedReview) {
        if (err) {
            req.flash("error", err.message);
            return res.redirect("back");
        }
        req.flash("success", "Your review has been sucecssfully updated")
        res.redirect("/reviews");
    });
});

// Reviews Delete
router.delete("/reviews/:review_id", isLoggedIn, function (req, res) {
    Review.findByIdAndRemove(req.params.review_id, function (err) {
        if (err) {
            req.flash("error", err.message);
            return res.redirect("back");
        }
        req.flash("success", "Your review has been sucecssfully deleted")
        res.redirect("/reviews");
    });
});




function calculateAverage(reviews) {
    if (reviews.length === 0) {
        return 0;
    }
    var sum = 0;
    reviews.forEach(function (element) {
        sum += element.rating;
    });
    return sum / reviews.length;
}

module.exports = router;