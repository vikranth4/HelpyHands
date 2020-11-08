var express = require("express");
var router = express.Router();
var Review = require("../models/review");
var User = require("../models/users");
var Seller=require("../models/seller")

isLoggedIn = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You need to Login ");
    res.redirect("/login");
}

router.get("/sellers",isLoggedIn,  function (req, res) {
    res.render("sellers/new");
});



// Sellers Create
router.post("/sellers",isLoggedIn,  function (req, res) {
    seller={
        username:req.body.username,
        code:req.body.code,
        category:req.body.category
    }
    
        Seller.create(seller, function (err, review) {
            if (err) {
                req.flash("error", err.message);
                return res.redirect("back");
            }
        
            res.redirect('/');
        });
    });

//sellers add products
 router.get("/seller/:id/add",isLoggedIn,function(req,res){
    Seller.findById(req.params.id,function(err,seller){
        res.render("sellers/add",{seller})
    })
 }) 
 
router.post("/seller/:id/add",function(req,res){
    Seller.findById(req.params.id,function(err,seller){
        product={
            name:req.body.name,
            price:req.body.price,
            picture:req.body.image
        }
        seller.products.push(product)
        seller.save();
        res.render("sellers/add",{seller})
    })
    
}) 

 router.get("/seller/:id",isLoggedIn,function(req,res){
    Seller.findById(req.params.id,function(err,seller){
        User.findById(req.user._id,function(err,user){
            res.render("sellers/show",{seller,user})
        })
        
    })
 });

 router.post("/:id/user/:userid/:product/cart",function(req,res){
     User.findById(req.params.userid,function(err,user){
        Seller.findById(req.params.id,function(err,seller){

            user.cart.push(req.params.product)
            user.save()
            req.flash("success", "Product succesfully added");
            res.render("sellers/show",{seller,user})
        });
     })
 })

module.exports = router;