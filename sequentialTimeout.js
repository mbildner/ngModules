;(function (window, document, angular) {


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
        });
      }
    }

    return getCallablesTimeout;
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
          });
      }
    }

    return getSequentialTimeout;
  });

  angular.module('mbildner.timeout').controller('DemoController', function($scope, $timeout, sequenceTimeout, callablesTimeout) {
    $scope.counter = 0;
    $scope.counter1 = 0;
    $scope.counter2 = 0;

    sequenceTimeout([1, 2, 3, 4, 5, 6, 7], function(count) {
      $scope.counter = count;
      return count;
    }, 1000).then(function(all) {
      console.log(all);
    });

    sequenceTimeout([1, 2, 3, 4, 5, 6, 7], function(count) {
      $scope.counter1 = count;
      return count;
    }, 580).then(function(all) {
      console.log(all);
    });

    sequenceTimeout([1, 2, 3, 4, 5, 6, 7], function(count) {
      $scope.counter2 = count;
      return count * 2;
    }, 400).then(function(all) {
      console.log(all);
    });

    sequenceTimeout(1, 2, 3, 4, 5, 6, 7, function(count) {
      return 12;
    }).then(function(a) {
      console.log('it worked!');
    }).
    catch (function(e) {
      console.log('it failed! ', e);
    });

    callablesTimeout(
      (function () { return 12; }),
      (function () { return 12; }),
      (function () { return 12; }),
      (function () { return 12; })
    ).then(function (numbers) {
      console.log('callables no arr no timeout');
      console.log(numbers);
    });

      callablesTimeout([
          (function () { return 12; }),
          (function () { return 12; }),
          (function () { return 12; }),
          (function () { return 12; })
    ]).then(function (numbers) {
      console.log('callables yes arr no timeout');
        console.log(numbers);
      });

    callablesTimeout(
      (function () { return 12; }),
      (function () { return 12; }),
      (function () { return 12; }),
      (function () { return 12; }),
      500
    ).then(function (numbers) {
      console.log('callables no arr yes timeout');
      console.log(numbers);
    });

    callablesTimeout([
        (function () { return 12; }),
        (function () { return 12; }),
        (function () { return 12; }),
        (function () { return 12; })
      ], 500
    ).then(function (numbers) {
      console.log('callables yes arr yes timeout');
      console.log(numbers);
    });

  });



})(window, document, angular);


