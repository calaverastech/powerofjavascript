var winston = require('winston');
var http = require("http");
var https = require("https");
var url = require("url");
var qs = require('querystring');
var _ = require("underscore");
var bodyParser = require('body-parser')
var routes = require('./routes');

//winston.add(winston.transports.File, { filename: 'server.log' });
//winston.remove(winston.transports.Console);

var YAHOO_FINANCE_URL =
	'https://query.yahooapis.com/v1/public/yql?q=';

var YAHOO_FINANCE_PARAMS = '&format=json&env='+qs.escape('store://datatables.org/alltableswithkeys');

var express = require('express'),
	app = express();

require('jade');
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.set('view options', {
    layout: false
});
	
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/bower_components'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var server = http.createServer(app);
//var server = http.createServer(function(request, response) {	
//});

app.get("/", routes.index);
app.get('/templates/:name', routes.templates);
app.get("/currencies", routes.currencies);

console.log(app.get("env"));
//console.log(app._router.stack);

var PORT = process.env.PORT || 5001;
var io = require('socket.io')(server);

server.listen(PORT);
//var io = require('socket.io')(PORT);
console.log('Server running at port ' + PORT);

io.on('connection', function(socket){
	winston.info("connected");
	winston.info(new Date());
	
	var symbols = ["YHOO","AAPL","GOOG","MSFT"];
	var pairs = {"EURUSD":"EUR/USD","USDJPY":"USD/JPY", "GBPUSD":"GBP/USD", "AUDUSD":"AUD/USD", "USDCAD":"USD/CAD", "USDCHF":"USD/CHF", "USDCNY":"USD/CNY", "EURJPY":"EUR/JPY", "EURGBP":"EUR/GBP"};
	var savedFinances = {},
		savedCurrencies = {};
	
	_.each(symbols, function(s) {
		savedFinances[s] = {Change: 0};
	});
	_.each(pairs, function(s, k) {
		savedCurrencies[k] = {Rate: null, Name: s};
	});
	
	function loadResource(eventName, query, resultKey, saved, id, changedKeys) {
		var path = YAHOO_FINANCE_URL+qs.escape(query)+YAHOO_FINANCE_PARAMS;
		//console.log(eventName, path);
		if(saved === undefined) {
			saved = {};
		}
		if(changedKeys === undefined) {
			changedKeys = {};
		}

		try {
			https.get(path, function(res) {
				console.log("statusCode: ", res.statusCode);
				var body = '';
				res.on("data", function(d) {
					body += d;
				});
				res.on("end", function() {
					try {
						var result = JSON.parse(body);
						if(!!result) {
							//var res = _.defaults(result.query.results, saved);
							var res = result.query.results;
							var quotes = _.map(res[resultKey], function(q) {
								_.each(changedKeys, function(k) {
								//_.each(saved[q[id]], function(v, k) {
									var val = parseFloat(q[k]);
									var v = saved[q[id]][k];
									//console.log(eventName, val, v);
									if(v != null) {
										//q[k + "Changed"] = ((val - v) !== 0)*q[k];
										q[k + "Changed"] = val - v;
									}
									//saved[q[id]][k] = val;
								});
								saved[q[id]] = q;
								return q;
							});
							socket.emit(eventName, _.defaults(quotes, saved));
						}
					} catch(err) {
						console.log("Can't parse result: " + err);
						winston.info("getting error " + eventName);
						winston.info(new Date());
					}	
				});
			}).on("error", function(e) {
				console.log("Error querying Yahoo finances: " + e);
			});
		} catch(e1) {
			console.log("can't access API");
		}
	}
	
	console.log("Server connected on socket " + socket.id);
	
	function prepareArray(arr) {
		return "(" + _.map(arr, function(a) {
			return '"'+a+'"';
		}).join(",") + ")";
	}
	
	var func = function() {
		loadResource("finances", 'select * from yahoo.finance.quotes where symbol in ' + prepareArray(symbols), "quote", savedFinances, "Symbol", ["Change"]);
		loadResource("majorCurrencies", 'select * from yahoo.finance.xchange where pair in ' + prepareArray(_.keys(pairs)), "rate", savedCurrencies, "id", ["Rate"]);
	}
	
	if(app.get("env") === "production") {
	  setInterval(function() { func() }, 5000);
	} else  {
	  func();
	}
});