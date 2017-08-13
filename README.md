# ngMockE2E for Protractor

[The node module](https://www.npmjs.com/package/ng-mock-e2e) significantly simplifies faking HTTP back end in [Protractor](http://protractortest.org/) end-to-end tests.

Check out [this tiny example project](https://github.com/yevhenpavliuk/ng-mock-e2e-example):

```javascript
const ngMockE2E = require('ng-mock-e2e');
const {$httpBackend} = ngMockE2E;

describe('example with ngMockE2E', () => {
  beforeEach(() => {
    ngMockE2E.addMockModule();
    ngMockE2E.addAsDependencyForModule('example');
    ngMockE2E.embedScript('bower_components/angular-mocks/angular-mocks.js');
  });

  afterEach(() => {
    ngMockE2E.clearMockModules();
  });

  it('should have heading "It works!" if the server responds "It works!"', () => {
    $httpBackend.when('GET', 'heading').respond('It works!');
    browser.get('/');
    expect($('h1').getText()).toEqual('It works!');
  });

  it('should have heading "It does work!" if the server responds "It does work!"', () => {
    $httpBackend.when('GET', 'heading').respond('It does work!');
    browser.get('/');
    expect($('h1').getText()).toEqual('It does work!');
  });

  it('should have heading "Unavailable" if the server responds 404', () => {
    $httpBackend.when('GET', 'heading').respond(404);
    browser.get('/');
    expect($('h1').getText()).toEqual('Unavailable');
  });
});
```

Here's how the same test suite looks without using [ngMockE2E node module](https://www.npmjs.com/package/ng-mock-e2e):

```javascript
describe('example without ngMockE2E', () => {
  beforeEach(() => {
    browser.addMockModule('example', () => {
      angular.module('example').requires.push('ngMockE2E');

      const script = document.createElement('script');
      script.src = 'bower_components/angular-mocks/angular-mocks.js';
      document.body.appendChild(script);
    });
  });

  afterEach(() => {
    browser.removeMockModule('example'); // For the mock module that's added in `beforeEach`.
    browser.removeMockModule('example'); // For the mock module that's added in `it`.
    // The number of removals should be equal to the number of additions.
    // Removing the mock module in `it` prevents all registered functions from execution.
  });

  it('should have heading "It works!" if the server responds "It works!"', () => {
    browser.addMockModule('example', () => {
      angular.module('example').
        run($httpBackend => {
          $httpBackend.when('GET', 'heading').respond('It works!');
        });
    });

    browser.get('/');
    expect($('h1').getText()).toEqual('It works!');
  });

  it('should have heading "It does work!" if the server responds "It does work!"', () => {
    browser.addMockModule('example', () => {
      angular.module('example').
        run($httpBackend => {
          $httpBackend.when('GET', 'heading').respond('It does work!');
        });
    });

    browser.get('/');
    expect($('h1').getText()).toEqual('It does work!');
  });

  it('should have heading "Unavailable" if the server responds 404', () => {
    browser.addMockModule('example', () => {
      angular.module('example').
        run($httpBackend => {
          $httpBackend.when('GET', 'heading').respond(404);
        });
    });

    browser.get('/');
    expect($('h1').getText()).toEqual('Unavailable');
  });
});
```

See [$httpBackend.when](https://docs.angularjs.org/api/ngMockE2E/service/$httpBackend#when).

If you find the project useful, please, star it. This shows me that it is needed and gives me enthusiasm for supporting it.
