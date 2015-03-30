# ngMockE2E

Mocking out HTTP backend implementation in Protractor end-to-end tests the same way it's done in AngularJS unit tests.


## Installation


```sh
npm install ng-mock-e2e --save-dev
```


## Usage Example

See [$httpBackend.when](https://docs.angularjs.org/api/ngMockE2E/service/$httpBackend#when).

```node
describe('when navigating to /', function () {

  var ngMockE2E = require('ng-mock-e2e');

  
  var $httpBackend = ngMockE2E.$httpBackend;


  beforeEach(function () {
    ngMockE2E.addMockModule();
    ngMockE2E.addAsDependencyForModule('myApp');
    ngMockE2E.embedScript('/bower_components/angular-mocks/angular-mocks.js');
  });


  afterEach(function () {
    ngMockE2E.clearMockModules();
  });


  it('should redirect to "#/a" if POST /get-redirection-url responds with "a"', function () {
    $httpBackend.when('POST', '/get-redirection-url').respond('a');
    browser.get('/');
    expect(browser.getCurrentUrl()).toBe(browser.baseUrl + '#/a');
  });


  it('should redirect to "#/b" if POST /get-redirection-url responds with "b"', function () {
    $httpBackend.when('POST', '/get-redirection-url').respond('b');
    browser.get('/');
    expect(browser.getCurrentUrl()).toBe(browser.baseUrl + '#/b');
  });

});
```

`ngMockE2E.addAsDependencyForModule('myApp')` (`myApp` should be replaced with the name of your application module) is a convenient way to add ngMockE2E dependency to your application module dynamically only for end-to-end testing. You don't need to call it if you add this dependency in a different way.

`ngMockE2E.embedScript('/bower_components/angular-mocks/angular-mocks.js')` is a convenient way to embed `angular-mocks.js` only for end-to-end testing. You don't need to call it if you embed this script in a different way.

## Development Notes

This is a development prototype shared for presentational purposes. I'm planning to rewrite it using TDD.

The following shortcut methods haven't been implemented yet: `whenGET`, `whenHEAD`, `whenDELETE`, `whenPOST`, `whenPOST`, `whenPATCH`, `whenJSONP`.


## Tips

Instead of writing `ngMockE2E.$httpBackend.when('GET', /*./).passThrough()` for each HTTP method, you can use the following shortcut that does it for you: `ngMockE2E.$httpBackend.passThrough()`.
