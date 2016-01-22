({
  paths: {
	jquery:  'bower_components/jquery/dist/jquery.min.js',
	jqueryui:  'bower_components/jquery-ui/jquery-ui.min.js',
    bootstrap: 'bower_components/bootstrap/dist/js/bootstrap.min.js',     
    angularjs: "bower_components/angular/angular.min.js",
    angularbootstrap: 'bower_components/angular-bootstrap/ui-bootstrap.min.js',
    angularroute: 'bower_components/angular-route/angular-route.min,js',
    angularresource: 'bower_components/angular-resource/angular-resource.min.js',
    angularanimate: 'bower_components/angular-animate/angular-animate.min.js',
    underscore:   'bower_components/underscore/underscore-min.js',
    angularunderscore: 'bower_components/angular-underscore/angular-underscore.min.js',
    angularmocks: 'bower_components/angular-mocks/angular-mocks.js',
    angularflash: 'bower_components/angular-flash/dist/angular-flash.min.js',
    angulartooltips: 'bower_components/angular-tooltips/dist/angular-tooltips.min.js',
    typeahead: 'bower_components/typeahead.js/dist/typeahead.bundle.min.js',
    angulartypeahead: 'bower_components/angular-typeahead/angular-typeahead.min.js',
    socketio: 'bower_components/socket.io-client/socket.io.js',
    infrastructure: "infrastructure"
  },
  fileExclusionRegExp: /^(.+\/)*(test.*|coverage)$/,
  underscore: {
      exports: "_"
  },
  shim: {
	    'socketio': {
	      exports: 'io'
		}
  },
  baseUrl : "js",
  removeCombined: true,
  findNestedDependencies: true,
  dir: "dist",
  optimizeAllPluginResources: true,
  noBuildTxt: true,
  optimizeCss: "standard",
  modules: [
		{
		    name: "app",
		    exclude: [
		       "infrastructure"
		    ]
		},
        {
            name: "infrastructure"
        }
	]
})