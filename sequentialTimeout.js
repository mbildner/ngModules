;(function (window, document, angular) {
  'use strict';

  function isFunction (obj) {
    return typeof obj === 'function';
  }

  function isNumber (obj) {
    return typeof obj === 'number';
  }

  var isArray = Array.isArray;

  function isEmpty(arr) {
    return arr.length === 0;
  }

  angular.module('mbildner.timeout', []);

  angular.module('mbildner.timeout').factory('callablesTimeout', function ($q, $timeout) {
    function normalizeCallablesTimeoutArgs (argsArr) {
      var args = [];

      var timeout;
      var sequence;

      var i;
      for (i = 0; i < argsArr.length; i++) {
        args.push(argsArr[i]);
      }

      timeout = isNumber(args[args.length - 1]) ? args.pop() : 0;
      sequence = (args.length === 1 && isArray(args[0])) ? args[0] : args;

      return [sequence, timeout];

    }


    function getCallablesTimeout (/* args */) {
      var allFinished = $q.defer();
      var allResults = [];

      var args = normalizeCallablesTimeoutArgs(arguments);

      args.push(allResults, allFinished);

      runCallablesTimeout.apply(null, args);

      return allFinished.promise;
    }

    function runCallablesTimeout (callablesArr, timeout, allResults, allFinished) {

      if (isArray(callablesArr) && isEmpty(callablesArr)) {
        allFinished.resolve(allResults);
      }
      else if (isArray(callablesArr) && !isEmpty(callablesArr)) {
        $timeout(function () {
          allResults.push(callablesArr.shift().call());
        }, timeout || 0)
        .then(function () {
          runCallablesTimeout(callablesArr, timeout, allResults, allFinished);
        })
        .catch(allFinished.reject);
      }
    }

    return getCallablesTimeout;
  });

  angular.module('mbildner.timeout').factory('deferrablesTimeout', function ($q, $timeout) {
    function normalizeDeferableSequenceArgs (argsArr) {
      var args = [];

      var timeout;
      var sequence;

      var i;
      for (i = 0; i < argsArr.length; i++) {
        args.push(argsArr[i]);
      }

      timeout = isNumber(args[args.length - 1]) ? args.pop() : 0;
      sequence = (args.length === 1 && isArray(args[0])) ? args[0] : args;

      return [sequence, timeout];
    }


    function getDeferableSeqTimeout (/* args */) {
      var allFinished = $q.defer();
      var allResults = [];

      var args = normalizeDeferableSequenceArgs(arguments);
      args.push(allResults, allFinished);
      runDeferableSeqTimeout.apply(null, args);
      return allFinished.promise;
    }

    function runDeferableSeqTimeout (deferrablesArr, timeout, allResults, allFinished) {

      if (isArray(deferrablesArr) && isEmpty(deferrablesArr)) {
        allFinished.resolve(allResults);
      }
      else if (isArray(deferrablesArr) && !isEmpty(deferrablesArr)) {
        var deferrables = deferrablesArr.shift()

        $timeout(function () {
          deferrables()
            .then(function (/* results */) {
              var args = [].slice.call(arguments);
              allResults.push(args);
            })
            .then(function () {
              runDeferableSeqTimeout(deferrablesArr, timeout, allResults, allFinished);
            })
            .catch(allFinished.reject);
        }, timeout || 0);
      }
    }


    return getDeferableSeqTimeout;

  });

  angular.module('mbildner.timeout').factory('sequenceTimeout', function ($q, $timeout) {
    function normalizeSequentialTimeoutArgs (argsArr) {
      var args = [];

      var timeout;
      var sequence;
      var callback;

      var i;
      for (i = 0; i < argsArr.length; i++) {
        args.push(argsArr[i]);
      }

      // func(... function () {});
      if (isFunction(args[args.length - 1])) {
        callback = args.pop();
      }
      // func(... function () {}, 10);
      else if (isNumber(args[args.length - 1]) && isFunction(args[args.length - 2])) {
        timeout = args.pop();
        callback = args.pop();
      }

      timeout = timeout || 0;
      sequence = (args.length === 1 && isArray(args[0])) ? args[0] : args;

      return [sequence, callback, timeout];
    }


    function getSequentialTimeout (/* args */) {
      var allFinished = $q.defer();
      var allResults = [];

      var args = normalizeSequentialTimeoutArgs(arguments);

      args.push(allResults, allFinished);

      runSequentialTimeout.apply(null, args);

      return allFinished.promise;

    }

    function runSequentialTimeout (sequence, callback, timeout, allResults, allFinished) {

      if (isArray(sequence) && isEmpty(sequence)) {
        allFinished.resolve(allResults);
      }
      else if (isArray(sequence) && !isEmpty(sequence)) {
        var currentVal = sequence.shift()

        $timeout(function() {
          allResults.push(callback(currentVal));
        }, timeout || 0)
          .then(function() {
            runSequentialTimeout(sequence, callback, timeout, allResults, allFinished);
          })
          .catch(allFinished.reject);

      }
    }

    return getSequentialTimeout;
  });

})(window, document, angular);


