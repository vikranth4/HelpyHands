var express = require("express"),
	app = express(),
	bodyParser = require("body-parser"),
	mongoose = require("mongoose"),
	Review = require("./models/review"),
	passport = require("passport"),
	LocalStrategy = require("passport-local"),
	User = require("./models/users"),
	methodOverride = require("method-override"),
	flash = require("connect-flash"),
	compression = require("compression");

var reviewRoutes = require("./routes/review");
var passwordReset = require("./routes/passwordReset");

app.use(compression());
mongoose.connect("mongodb://localhost/helpy_hands", {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true,
	useUnifiedTopology: true,
	useFindAndModify: false
});
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));

require('dotenv').config();
app.use(flash());

//passport config
app.use(require("express-session")({
	secret: "I am the best",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function (req, res, next) {
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.use(express.static(__dirname + '/public/images', {
	maxAge: 86400000,
	setHeaders: function (res, path) {
		res.setHeader("Expires", new Date(Date.now() + 2592000000 * 30).toUTCString());
	}
}))

app.get('/*', function (req, res, next) {

	if (req.url.indexOf("/images/") === 0 || req.url.indexOf("/stylesheets/") === 0) {
		res.setHeader("Cache-Control", "public, max-age=2592000");
		res.setHeader("Expires", new Date(Date.now() + 2592000000).toUTCString());
	}
	next();
});
//============================================================================

app.get("/", function (req, res) {
	res.render("home");
});

//register route

app.get("/register", function (req, res) {
	res.render("register", { page: 'register' });
});

app.post("/register", function (req, res) {
	var newUser = new User({
		username: req.body.username,
		email: req.body.email,
	});
	User.register(newUser, req.body.password, function (err, user) {
		if (err) {
			req.flash("error", err.message);
			return res.render("register", { "error": err.message });
		}
		passport.authenticate("local")(req, res, function () {
			user.email = req.body.email;
			req.flash("success", "Welcome to HelpyHands " + user.username + "!!");
			res.redirect("/");
		});
	});
});

//LogIn Route

app.get("/login", function (req, res) {
	res.render("login", { page: 'login' });
})

app.post("/login", function (req, res, next) {
	passport.authenticate("local",
		{
			successRedirect: "/reviews",
			failureRedirect: "/login",
			failureFlash: true,
			successFlash: "Welcome to HelpyHands, " + req.body.username + "!"
		})(req, res);
});

//logOut route

isLoggedIn = function (req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect("/login");
}

app.get("/logout", isLoggedIn, function (req, res) {
	req.logout();
	req.flash("success", "Logged Out")
	res.redirect("/");
});



app.use(reviewRoutes);
app.use(passwordReset);

//=================================================================================
app.listen(3000, function () {
	console.log("Server started at port 3000 ");
});