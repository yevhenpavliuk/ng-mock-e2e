'use strict';


var toSrc = require('toSrc');


var ngMockE2E = {

  /**
   * @type {!Object.<function>}
   * @private
   */
  mockModules_: {

    addMockModule: function () {
      angular.module('ngMockE2E_', []);
    },


    /**
     * @param {string} name
     */
    addAsDependencyForModule: function (name) {
      angular.module(name).requires.push('ngMockE2E');
    },


    /**
     * @param {string} url
     */
    embedScript: function (url) {
      var script = document.createElement('script');
      script.src = url;
      document.body.appendChild(script);
    }

  },


  addMockModule: function () {
    browser.addMockModule('ngMockE2E_', ngMockE2E.mockModules_.addMockModule);
  },


  clearMockModules: function () {
    var hasModule;
    var registeredMockModules;
    do {
      registeredMockModules = browser.getRegisteredMockModules();
      if (registeredMockModules.length) {
        hasModule = registeredMockModules.some(function (mockModule) {
          return mockModule == ngMockE2E.mockModules_.addMockModule ||
              mockModule == ngMockE2E.mockModules_.addAsDependencyForModule ||
              mockModule == ngMockE2E.mockModules_.embedScript ||
              mockModule == ngMockE2E.$httpBackend.mockModules_.when ||
              mockModule == ngMockE2E.$httpBackend.mockModules_.whenRespond ||
              mockModule == ngMockE2E.$httpBackend.mockModules_.whenPassThrough ||
              mockModule == ngMockE2E.$httpBackend.mockModules_.passThrough;
        });
      } else {
        hasModule = false;
      }
      if (hasModule) {
        browser.removeMockModule('ngMockE2E_');
      }
    } while (hasModule);
  },


  /**
   * @param {string} name
   */
  addAsDependencyForModule: function (name) {
    browser.addMockModule('ngMockE2E_', ngMockE2E.mockModules_.addAsDependencyForModule, name);
  },


  /**
   * @param {string} url
   */
  embedScript: function (url) {
    browser.addMockModule('ngMockE2E_', ngMockE2E.mockModules_.embedScript, url);
  },


  $httpBackend: {

    /**
     * @type {!Object.<function>}
     * @private
     */
    mockModules_: {

      /**
       * @param {!Array.<string>} whenArgumentsEvaluativeJavaScript
       * @param {string} requestHandlerKey
       */
      when: function (whenArgumentsEvaluativeJavaScript, requestHandlerKey) {
        angular.module('ngMockE2E').run(function ($httpBackend) {
          if (!window.requestHandlers_) {
            window.requestHandlers_ = {};
          }
          var whenArguments = whenArgumentsEvaluativeJavaScript.map(function (src) {
            var value;
            eval('value = ' + src);
            return value;
          });
          var requestHandler = $httpBackend.when.apply($httpBackend, whenArguments);
          window.requestHandlers_[requestHandlerKey] = requestHandler;
        });
      },


      /**
       * @param {!Array.<string>} respondArgumentsEvaluativeJavaScript
       * @param {string} requestHandlerKey
       */
      whenRespond: function (respondArgumentsEvaluativeJavaScript, requestHandlerKey) {
        angular.module('ngMockE2E').run(function () {
          var requestHandler = window.requestHandlers_[requestHandlerKey];
          var respondArguments = respondArgumentsEvaluativeJavaScript.map(function (sourceCode) {
            var value;
            eval('value = ' + sourceCode);
            return value;
          });
          requestHandler.respond.apply(requestHandler, respondArguments);
        });
      },


      /**
       * @param {string} requestHandlerKey
       */
      whenPassThrough: function (requestHandlerKey) {
        angular.module('ngMockE2E').run(function () {
          var requestHandler = window.requestHandlers_[requestHandlerKey];
          requestHandler.passThrough();
        });
      },


      passThrough: function () {
        angular.module('ngMockE2E').run(function ($httpBackend) {
          var ANY_URL = /.*/;
          $httpBackend.whenGET(ANY_URL).passThrough();
          $httpBackend.whenHEAD(ANY_URL).passThrough();
          $httpBackend.whenDELETE(ANY_URL).passThrough();
          $httpBackend.whenPOST(ANY_URL).passThrough();
          $httpBackend.whenPUT(ANY_URL).passThrough();
          $httpBackend.whenPATCH(ANY_URL).passThrough();
        });
      }

    },


    /**
     * @type {number}
     * @private
     */
    requestHandlerKey_: 0,


    /**
     * @returns {number}
     * @private
     */
    getUniqueRequestHandlerKey_: function () {
      ngMockE2E.$httpBackend.requestHandlerKey_ = ngMockE2E.$httpBackend.requestHandlerKey_ + 1;
      return ngMockE2E.$httpBackend.requestHandlerKey_;
    },


    /**
     * @param {!Object} args
     * @returns {!Array}
     * @private
     */
    convertArgumentsToArray_: function (args) {
      return Array.prototype.slice.call(args);
    },


    /**
     * @param {!Array.<*>} array
     * @returns {!Array.<string>}
     * @private
     */
    convertArrayElementsToJavaScriptCode_: function (array) {
      return array.map(function (element) {
        return toSrc(element);
      });
    },


    /**
     * @see https://docs.angularjs.org/api/ngMockE2E/service/$httpBackend#when
     */
    when: function () {
      var whenArguments = ngMockE2E.$httpBackend.convertArgumentsToArray_(arguments);
      var whenArgumentsEvaluativeJavaScript = ngMockE2E.$httpBackend.convertArrayElementsToJavaScriptCode_(whenArguments);
      var requestHandlerKey = this.getUniqueRequestHandlerKey_();
      browser.addMockModule('ngMockE2E_', ngMockE2E.$httpBackend.mockModules_.when, whenArgumentsEvaluativeJavaScript, requestHandlerKey);

      return {
        respond: function () {
          var respondArguments = ngMockE2E.$httpBackend.convertArgumentsToArray_(arguments);
          var respondArgumentsEvaluativeJavaScript = ngMockE2E.$httpBackend.convertArrayElementsToJavaScriptCode_(respondArguments);
          browser.addMockModule('ngMockE2E_', ngMockE2E.$httpBackend.mockModules_.whenRespond, respondArgumentsEvaluativeJavaScript, requestHandlerKey);
        },

        passThrough: function () {
          browser.addMockModule('ngMockE2E_', ngMockE2E.$httpBackend.mockModules_.whenPassThrough, requestHandlerKey);
        }
      };
    },


    passThrough: function () {
      browser.addMockModule('ngMockE2E_', ngMockE2E.$httpBackend.mockModules_.passThrough);
    }

  }

};


module.exports = ngMockE2E;
