# karma-jasmine-async

A Karma plugin. Similar Mocha style asynchronous testing for Jasmine.

## About Jasmine.Async

[Jasmine](http://pivotal.github.com/jasmine/) is a great BDD-style testing framework
for browser based JavaScript, and my preferred tool for doing
that kind of work. But the asynchronous testing story in Jasmine
is painful at best. 

Thus, Jasmine.Async was born out of frustration and little bit
of jealousy in how easy it is to do async tests with [Mocha](http://visionmedia.github.com/mocha/). 

## Source Code And Downloads

You can download the raw source code from the "src" folder above. 

To get the latest stable release, use these links which point to the 'master' branch's builds:

### Standard Builds

* Development: [jasmine.async.js](https://raw.githubusercontent.com/alextseng/karma-jasmine-async/master/src/jasmine.async.js)

## Basic Usage

```js
describe("an async spec", function(){

  // set up the async spec
  var async = new AsyncSpec(this);

  // run an async setup
  async.beforeEach(function(done){
    doSomething();

    // simulate async stuff and wait 10ms
    setTimeout(function(){

      // more code here
      doMoreStuff();
 
      // when the async stuff is done, call `done()`
      done();

    }, 10); 
  });

  // run an async cleanup
  async.afterEach(function(done){
    // simulate async cleanup
    setTimeout(function(){

      done(); // done with the async stuff

    }, 10);
  });

  // run an async expectation
  async.it("did stuff", function(done){

    // simulate async code again
    setTimeout(function(){

      expect(1).toBe(1);
      
      // all async stuff done, and spec asserted
      done();

    });    

  });

});
```