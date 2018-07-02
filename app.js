var express        = require("express"),
    mongoose       = require("mongoose"),
    bodyParser     = require("body-parser"),
    methodOverride = require("method-override"),
    flash          = require('connect-flash'),
    passport       = require("passport"),
    LocalStrategy  = require("passport-local"),
    nodemailer     = require("nodemailer"),
    User           = require("./models/user"),
    Message        = require("./models/message"),
    Thread         = require("./models/thread"),
    seedDb         = require("./seed"),
    app            = express();

//require routes
var userRoutes       = require("./routes/user.js"),
    indexRoutes      = require("./routes/index.js"),
    adminRoutes      = require("./routes/admin.js"),
    messageRoutes    = require("./routes/message.js"),
    schedulingRoutes = require("./routes/scheduling.js");

mongoose.connect("mongodb://admin:timecard123@ds245210.mlab.com:45210/timecard_system");
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.use(flash());                  

//SEED DATABASE
//seedDb();

//PASSPORT CONFIG

app.use(require("express-session")({
    secret: "Zelda is a cutie",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.user        = req.user;
    res.locals.error       = req.flash("error");
    res.locals.success     = req.flash("success");
    next();
});

app.use(indexRoutes);
app.use("/users", userRoutes);
app.use("/admin", adminRoutes);
app.use("/users/messages", messageRoutes);
app.use("/admin/scheduling", schedulingRoutes);

app.all('*', function (req, res) {
    req.flash("error", "Not a page");
    res.redirect("/");
});

app.listen(27017 || process.env.PORT, function(){
    console.log("Server Started...");
});