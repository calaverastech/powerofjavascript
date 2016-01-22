var cc = require('currency-codes');
var _ = require("underscore");

exports.index = function(req, res){
  res.render('index');
};

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