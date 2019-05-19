var express = require('express');
var Handlebars = require('handlebars');
var Utils = require('../utils/utils');

var router = express.Router();

router.get('/', function(req, res){
	res.render('index');
});

router.post('/', function(req, res){
	var recording = req.body.recording;
	Utils.uploadToGoogleCloud(recording, function(){
		Utils.fetchTextFromGoogleCloud(function(transcription){
				Utils.deleteFromGoogleCloud();
				res.status(200).send({scribe:transcription});
			}, function(err){
				console.log("failure : controller");
				console.log(err)
				Utils.deleteFromGoogleCloud();
				res.status(400).send({errorText:"ERROR FETCHING DATA"});
			});
		
	}, function(){
		res.status(400).send({errorText:"ERROR FETCHING DATA"});
	});

});

module.exports = router;
