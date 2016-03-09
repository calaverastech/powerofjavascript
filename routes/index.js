var cc = require('currency-codes');
var _ = require("underscore");
var fs = require("fs");

var config = JSON.parse(fs.readFileSync(process.cwd() + "/resources/balls.json")),
	BALLS = config.balls,
	CODELENGTH = config.codelength;

exports.index = function(req, res){
  res.render('index');
};

exports.mastermind = function(req, res) {
	res.render('mastermind');
}

exports.gameparams = function(req, res) {
	res.status(200).jsonp({ballstr: JSON.stringify(BALLS), codestr: JSON.stringify(CODELENGTH)});
}

exports.generategame = function(req, res) {
	var arr = [];
	var codelength = Number(req.params.codelength);
	var duplicates = req.params.duplicates;
	var ballnames = _.keys(BALLS);
	if(!!duplicates) {
		_(codelength).times(function(n) {
			arr.push(_.sample(ballnames));
		});
	} else {
		arr = _.sample(ballnames, codelength);
	}
	res.set('Access-Control-Allow-Origin', '*');
	res.status(200).jsonp(arr);
}

exports.currencies = function(req, res) {
    var currencyCodes = [];
	_.each(cc.countries(), function(cnt) {
		var curr = cc.country(cnt);
		_.each(curr, function(c) {
			var code = c.code;
			currencyCodes.push({curr: code, name: code});
			currencyCodes.push({curr: code, name: cnt + " (" + code + ")"})
		});
	});
	//console.log(currencyCodes);
	res.set('Access-Control-Allow-Origin', '*');
	res.status(200).json(currencyCodes);
}

exports.templates = function (req, res) {
  var name = req.params.name;
  res.render('templates/' + name);
};