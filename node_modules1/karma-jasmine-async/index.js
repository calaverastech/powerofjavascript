var createPattern = function(path) {
  return {pattern: path, included: true, served: true, watched: false};
};

var initJasmineAsync = function(files) {
  files.unshift(createPattern(__dirname + '/src/jasmine.async.js'));
};

initJasmineAsync.$inject = ['config.files'];

module.exports = {
  'framework:jasmine.async': ['factory', initJasmineAsync]
};
