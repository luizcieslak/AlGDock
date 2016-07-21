// This script is linked to the root location in the web GUI ('localhost:3000/').
// It handles the routing for the GUI, so that the correct html page is rendered when the browser GETS a URL within the app

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var crypto = require('crypto');
var nodemailer = require('nodemailer');	// for sending the user verification emails after registration

var fs = require('fs');
var path = require('path');
var exec = require('child_process').exec;

var People = require('../public/models/people.js'); // MongoDB schema for a user

var transporter = require('../public/mailer.js'); // this script contains the info for the email account that will be used to send the emails. It can be generated by running mailer.sh
var valid_user = require('./valid_user'); // this script checks if a user exists and is logged in

var download = require('../public/js/downloads.js'); // this script contains a function to allow downloading results from the cluster

/* --------------------
   | Helper Functions |
   -------------------- */

fs.readdirSync(__dirname + '/../public/models').forEach(function (filename) {
  if (~filename.indexOf('.js')) require(__dirname + '/../public/models/' + filename)

});

function create_hash(str) {
    return crypto.createHash('md5').update(str).digest('hex');
}

function generate_tok() {
    return crypto.randomBytes(16).toString('base64').replace('/', '');
}

function send_mail(mail){
	// sends whatever is in the mail variable to the user's email from the email account in mailer.js
    transporter.sendMail(mail, function(error, info){
	if(error){
            console.log(error);
	}else{
            console.log('Message sent: ' + info.response);
	}
    });
}

function db_save(model) {
	// saves info to the mongo database
    model.save(function (err) {
	if (err) console.log(err);
    });
}

/* ----------
   | Routes |
   ---------- */

// Main page
// When browsers try to access 'localhost:3000/' (for locally-run GUI)
// First uses valid_user.js to check if user is logged in (if not, renders login/registration page instead)
// Then renders index.hjs page
router.get('/', valid_user, function(req, res, next) {
    res.render('index',
        {
          title: 'AlGDock',
          partials: {header: 'header', footer: 'footer'},

          alert_type: 'alert-danger',
          alert: 'This email is already in use. Did you forget your password?',
          user: req.cookies.user
        });
}); 

// Login page - added by Christopher
// When browsers try to access 'localhost:3000/login'
// Renders login.hjs page
router.get('/login', function(req, res, next) {
    res.render('login',
        {
           	title: 'AlGDock | Login',
          	hide_class : 'hide_elt',
    		alert_type: '',
    		alert: '',
           	partials: {header: 'header', footer: 'footer'},
        });
});

// Registration page - added by Christopher
// When browsers try to access 'localhost:3000/register'
// Renders register.hjs page
router.get('/register', function(req, res, next) {
    res.render('register',
        {
           	title: 'AlGDock | Register',
           	hide_class : 'hide_elt',
    		alert_type: '',
    		alert: '',
           	partials: {header: 'header', footer: 'footer'},
        });
});

// Test page - added by Christopher
// Renders test page
router.get('/test', function(req, res, next) {
    res.render('test',
        {
           	title: 'test page'
        });
});

// Axure Home page HTML - added by Iva
// This is a test to see if rendering Axure's generated html works
// It works if you change the .html file extension to .hjs, but without any styles
// Still need to fix access to the source js and css styles so that it renders properly
// May require a different templating engine than hjs, but I'm not sure
    res.render('0_1_0_0_home',
    	{
    		title: 'AlGDock | Axure Home',
    		user: req.cookies.user
    	});
}); 

// Pre-run page - added by Christopher
// This is a duplicate to Pedro's pre-run route (see below)
// Keeping Pedro's because it keeps track of cookies
/*
router.get('/pre-run', function(req, res, next) {
    res.render('pre-run',
        {
           	partials: {header: 'header', footer: 'footer'},
        });
});
*/

// Temp route to selection page
// When browsers try to access 'localhost:3000/selection'
// Renders selection.hjs page
// We probably won't need this once we restructure
router.get('/selection/', valid_user, function(req, res, next) {
	console.log('Navigating to selection page');
    res.render('selection',
        {
          title: 'AlGDock | Selection',
          partials: {header: 'header', footer: 'footer'},
          user: req.cookies.user
        });
});

// Protein selection page - added by Iva
// When browsers try to access 'localhost:3000/proteins'
// Renders protein-selection.hjs page
// We probably won't need this once we restructure
router.get('/proteins', function(req, res, next) {
	res.render('protein-selection',
      {
        title: 'AlGDock | Protein Selection',
        partials: {header: 'header', footer: 'footer'},
        user: req.cookies.user
      });
});

// Ligand Library selection page - added by Pedro
// When browsers try to access 'localhost:3000/ligandLibrary'
// Renders ligand-library.hjs page
// We probably won't need this once we restructure
router.get('/ligandLibrary', function(req, res, next) {
  res.render('ligand-library',
      {
        title: 'AlGDock | Ligand Library Selection',
        partials: {header: 'header', footer: 'footer'},
        user: req.cookies.user
      });
});

// About Us page - added by Pedro
// When browsers try to access 'localhost:3000/about'
// Renders about.hjs page
// Button for this is in Footer (footer.hjs)
router.get('/about', function(req, res, next) {
  res.render('about',
      {
        title: 'AlGDock | About Us',
        partials: {header: 'header', footer: 'footer'},
        user: req.cookies.user
      });
});

// Jobs Status page - added by Pedro
// When browsers try to access 'localhost:3000/jobs'
// Renders view-jobs.hjs page
router.get('/jobs', function(req, res, next) {
  res.render('view-jobs',
      {
        title: 'AlGDock | Jobs',
        partials: {header: 'header', footer: 'footer'},
        user: req.cookies.user
      });
});

// Pre Run page - added by Pedro
// When browsers try to access 'localhost:3000/prerun'
// Renders pre-run.hjs page
router.get('/prerun', function(req, res, next) {
  res.render('pre-run',
      {
        title: 'AlGDock | XXXXX',
        partials: {header: 'header', footer: 'footer'},
        user: req.cookies.user,
      });
});

// Tutorials page - added by Iva
// When browsers try to access 'localhost:3000/tutorial'
// Renders tutorial.hjs page
// Button for this is in Footer (footer.hjs)
router.get('/tutorial', function(req, res, next) {
	res.render('tutorial',
      {
        title: 'AlGDock | Tutorial',
        partials: {header: 'header', footer: 'footer'},
        user: req.cookies.user
      });
});

// Publications page - added by Iva
// When browsers try to access 'localhost:3000/pubs'
// Renders publications.hjs page
// Button for this is in Footer (footer.hjs)
router.get('/pubs', function(req, res, next) {
	res.render('publications',
      {
        title: 'AlGDock | Publications',
        partials: {header: 'header', footer: 'footer'},
        user: req.cookies.user
      });
});

// Data Report page - added by Iva
// When browsers try to access 'localhost:3000/report_jobID'
// Renders view-data-report.hjs
// NOTE: Change this to render different data depending on jobID
// The button for this is on the Job Report page
router.get('/report_jobID', function(req, res, next) {
	res.render('view-data-report',
      {
        title: 'AlGDock | Data Report',
        partials: {header: 'header', footer: 'footer'},
        user: req.cookies.user
      });
});

// Data Report download - added by Iva
// When browsers try to access 'localhost:3000/report_jobID/:protein/:ligand'
// Downloads file and then renders Job Report page again
// The button for this is on the Job Report page
// download_file function defined in downloads.js
router.get('/report_jobID/:protein/:ligand', function(req, res, next) {
	var protein = req.params.protein;
	var ligand = req.params.ligand;
	var user_email = req.cookies.user;
	download.download_file(user_email, protein, ligand);
	//after download occurs, show Jobs page again
	res.redirect('/jobs');
});

// Smiles SVG Image
// When browsers try to access 'localhost:3000/getSvg/:lineNumber/:smiles'
router.get('/getSvg/:lineNumber/:smiles', function(req, res) {
    var lineNumber = req.params.lineNumber;
    var smilesStr = req.params.smiles;
    var child_proc = exec('obabel -:"' + smilesStr + '" -xP 80 -O public/svg/' + lineNumber + '.svg');
    child_proc.stdout.pipe(process.stdout);
    child_proc.on('exit', function() {
	res.sendFile(path.join(__dirname, '../public/svg', lineNumber + '.svg'));
    });
});

// User Login
router.post('/', function(req, res) {
	// Try to find the existing user in the algdock database
    mongoose.model('peoples').findOne({people_username : req.body.login_mail}, function(err, peoples) {
		// if this user does not exist, show the Registration page
		if (peoples === null) {
			console.log(err);
			res.render('register',
      {
        title: 'AlGDock | Login or Register',
        hide_class : '',
        alert_type: 'alert-danger',
        alert: "We're sorry. We could not find a user with those credentials.",
        partials: {header: 'header', footer: 'footer'},
      });
		}
		// If the user was found and entered the correct password, generate cookies and render Home page
		else if (create_hash(req.body.login_pass) === peoples["people_password"]){
			logged_tok = generate_tok();
			res.cookie('logged_tok', logged_tok);
			res.cookie('user', peoples["people_username"]);
			peoples["logged_tok"] = logged_tok;
			db_save(peoples);
			res.redirect('/');
		}
		// If user was found but entered incorrect credentials, render Registration page
		else {
			res.render('register',
      {
        title: 'AlGDock | Login or Register',
        hide_class : '',
        alert_type: 'alert-danger',
        alert: 'Invalid log in.',
        partials: {header: 'header', footer: 'footer'}
      });
		}
    });
});

// User Registration
router.post('/reg', function(req, res, next) {
    var email = req.body.reg_mail;
    // try to find registered user in algdock database
    mongoose.model('peoples').findOne({people_username : email}, function(err, peoples){
    	// if this user was already registered, show Login page
		if(peoples !== null) {
			res.render('login',
      {
        title: 'AlGDock | Login or Register',
        hide_class : '',
        alert_type: 'alert-danger',
        alert: 'This email is already in use. Did you forget your password?',
        partials: {header: 'header', footer: 'footer'}
      });
		}
		// if this is a newly registered user, add user to the database and send a Verification Email, then show Login page
		else {
			var token = generate_tok();
			var new_people = new People({
			people_username : email,
			people_password : create_hash(req.body.reg_pass2),
			email_verify : token
			});
			db_save(new_people);

			// Link to verification page
			verify_link = 'http://localhost:3000/verify_email/' + email + '/' + token;

			var verifyEmail = {
				from: 'AlGDock Admin <algdock.ipro@gmail.com>',
				to: email,
				subject: 'AlGDock | Email Verification',
				html: 'You are receiving this message because you must verify your email address.<br><br>Just click the link below and you are done!<br>' + '<a href=\"' + verify_link + '\">' + verify_link + '</a>'
			};

			send_mail(verifyEmail); // Verification email sent from account in mailer.js to user's email account
			res.render('login',
      {
        title: 'AlGDock | Login or Register',
        hide_class : '',
        alert_type: 'alert-success',
        alert : "You have been successfully registered, please verify your email address. An email has been sent to you.",
        partials: {header: 'header', footer: 'footer'}
      });
		}
	});
});

// Verify email - called when user clicks on link in Verification email
router.get('/verify_email/:email/:tok', function(req, res) {
	// try to find user in algdock database
    mongoose.model('peoples').findOne({people_username : req.params.email}, function(err, peoples){
    // if the token from the email matches up with the token saved in the user's profile in the database, update the user's last_login field and render the Login page
	if (peoples["email_verify"] === req.params.tok){
	    peoples.last_login = Date.now();
	    db_save(peoples);

	    res.render('login',
      {
        title: 'AlGDock | Login or Register',
        hide_class: '',
        alert_type: 'alert-success',
        alert : 'Your email has been successfully verified. You may now log in.',
        partials: {header: 'header', footer: 'footer'}
      });
	}
	// if the tokens do not match, throw an error and render the error.hjs page
	else{
	    var err = new Error('Not Found.')
	    res.render('error', {message : err.message, error: err});
	}
    });
});

// Logout button - clears cookies to log out the user and renders the home page (which should in turn redirect to Login/Registration since user is not logged in anymore)
router.get('/logout', function(req, res) {
    res.clearCookie('logged_tok');
    res.clearCookie('user');
    res.redirect('/');
});


module.exports = router;
