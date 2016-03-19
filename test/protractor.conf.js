exports.config = {
  specs: [
    'e2e/*.js'
  ],

  multiCapabilities: [{
    'browserName': 'chrome'
  }, {
	'browserName': 'firefox'   
  }],
  
  maxSessions: 1,

  chromeOnly: true,

  baseUrl: 'http://localhost:5001/',

  framework: 'jasmine',

  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000
  },
  
  rootElement: "#approot",
  untrackOutstandingTimeouts: true,
  allScriptsTimeout: 30000
};
