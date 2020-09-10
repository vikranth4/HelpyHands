var express = require("express");
var router = express.Router();
var Review = require("../models/review");
var User = require("../models/users");

isLoggedIn = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You need to Login to give your feedback");
    res.redirect("/login");
}

checkReviewOwnership = function (req, res, next) {
    if (req.isAuthenticated()) {
        Review.findById(req.params.id, function (err, foundReview) {
            if (err || !foundReview) {
                res.redirect("back");
            } else {
                // does user own the comment?
                if (foundReview.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
}

checkReviewExistence = function (req, res, next) {
    if (req.isAuthenticated()) {
        User.findById(req.user._id).populate("reviews").exec(function (err, user) {
            if (err || !user) {
                req.flash("error", "User not authorized");
                res.redirect("back");
            } else {
                // check if req.user._id exists in foundCampground.reviews
                var foundUserReview = user.reviews.some(function (review) {
                    return review.author.id.equals(req.user._id);
                });
                if (foundUserReview) {
                    req.flash("error", "You have already given your feedback.");
                    return res.redirect("/reviews");
                }
                // if the review was not found, go to the next middleware
                next();
            }
        });
    } else {
        req.flash("error", "You need to login first.");
        res.redirect("back");
    }
};


// Reviews Index
router.get("/reviews", function (req, res) {
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
router.get("/reviews/new", isLoggedIn, checkReviewExistence, function (req, res) {

    Review.find({}, function (err, reviews) {
        if (err) {
            req.flash("error", err.message);
            return res.redirect("back");
        }
        res.render("review/new", { reviews: reviews });

    });
});


// Reviews Create
router.post("/reviews", isLoggedIn, checkReviewExistence, function (req, res) {
    User.findById(req.user._id).populate("reviews").exec(function (err, user) {
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
            user.reviews.push(review);
            user.save();
            req.flash("success", "Your review has been sucecssfully added")
            res.redirect('/reviews');
        });
    });


});

// Reviews Edit
router.get("/reviews/:id/edit", isLoggedIn, checkReviewOwnership, function (req, res) {
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
router.put("/reviews/:review_id", isLoggedIn, checkReviewOwnership, function (req, res) {
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