module.exports = function(config){
  config.set({

    basePath : '../',
    
    files : [
      {
    	 pattern: 'test/fixtures/*.json' 
      },
      'bower_components/jquery/dist/jquery.js',
      'bower_components/jquery-ui/jquery-ui.js',
      'bower_components/bootstrap/dist/js/bootstrap.js',     
      'bower_components/angular/angular.js',
      'bower_components/angular-bootstrap/ui-bootstrap.js',
      'bower_components/angular-route/angular-route.js',
      'bower_components/angular-resource/angular-resource.js',
      'bower_components/angular-animate/angular-animate.js',
      'bower_components/underscore/underscore.js',
      'bower_components/angular-underscore/angular-underscore.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'bower_components/angular-flash/dist/angular-flash.js',
      'bower_components/angular-tooltips/dist/angular-tooltips.js',
      'bower_components/typeahead.js/dist/typeahead.bundle.js',
      'bower_components/angular-typeahead/angular-typeahead.js',
      'bower_components/ngstorage/ngStorage.js',
      'public/js/app.js',
      'public/js/**/*.js',
      'test/unit/**/*_spec.js'
    ],
    exclude: [
       "public/js/infrastructure.js"
    ],

    autoWatch : true,

    frameworks: ['jasmine', 'fixture'],
    
    preprocessors: {
        '**/*.html'   : ['html2js'],
        '**/*.json'   : ['json_fixtures']
      },
      
    jsonFixturesPreprocessor: {
          variableName: '__json__'
    },

    browsers : ['Firefox', 'PhantomJS'],

    plugins : [
            'karma-fixture',
            'karma-html2js-preprocessor',
            'karma-json-fixtures-preprocessor',
            'karma-phantomjs-launcher',
            'karma-jasmine'
            ],

    junitReporter : {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    }

  });
};