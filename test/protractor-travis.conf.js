exports.config = {
  specs: [
    'e2e/*.js'
  ],

  capabilities: {
	'browserName': 'firefox'   
  },
  
  maxSessions: 1,

  chromeOnly: true,

  baseUrl: 'http://localhost:5001/',

  framework: 'jasmine',

  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000
  },
  
  rootElement: "#yahoofinances",
  untrackOutstandingTimeouts: true,
  allScriptsTimeout: 30000
};