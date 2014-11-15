describe('sequenceTimeout', function () {

  var callablesTimeout;
  var sequenceTimeout;
  var $timeout;

  beforeEach(module('mbildner.timeout'));

  beforeEach(inject(function ($injector) {
    callablesTimeout = $injector.get('callablesTimeout');
    sequenceTimeout = $injector.get('sequenceTimeout');
    $timeout = $injector.get('$timeout');
  }));

  describe('callablesTimeout factory', function () {
    it('array, timeout', function () {
      var valueToVerify;
      callablesTimeout([
        (function () { return 1; }),
        (function () { return 2; }),
        (function () { return 3; }),
        (function () { return 4; })
      ], 0).then(function (numbers) {
        valueToVerify = numbers;
        return [1, 2, 3, 4];
      });

      $timeout.flush();
      expect(valueToVerify).toEqual([1, 2, 3, 4]);
    });

    it('array', function () {
      var valueToVerify;
      callablesTimeout([
        (function () { return 1; }),
        (function () { return 2; }),
        (function () { return 3; }),
        (function () { return 4; })
      ]).then(function (numbers) {
        valueToVerify = numbers;
        return [1, 2, 3, 4];
      });

      $timeout.flush();
      expect(valueToVerify).toEqual([1, 2, 3, 4]);
    });

    it('arguments, timeout', function () {
      var valueToVerify;
      callablesTimeout(
        (function () { return 1; }),
        (function () { return 2; }),
        (function () { return 3; }),
        (function () { return 4; }),
        0
      ).then(function (numbers) {
        valueToVerify = numbers;
        return [1, 2, 3, 4];
      });

      $timeout.flush();
      expect(valueToVerify).toEqual([1, 2, 3, 4]);
    });

    it('arguments', function () {
      var valueToVerify;
      callablesTimeout(
        (function () { return 1; }),
        (function () { return 2; }),
        (function () { return 3; }),
        (function () { return 4; })
      ).then(function (numbers) {
        valueToVerify = numbers;
        return [1, 2, 3, 4];
      });

      $timeout.flush();
      expect(valueToVerify).toEqual([1, 2, 3, 4]);
    });
  });

  describe('sequenceTimeout factory', function () {
    it('array, callback, timeout', function () {
      var valueToVerify;
      // tests fail with anything but 0ms timeouts - why?
      sequenceTimeout([1, 2, 3, 4, 5, 6, 7], function (count) {
        return count * 2;
      }, 0).then(function(all) {
        valueToVerify = all;
      });

      $timeout.flush();
      expect(valueToVerify).toEqual([2, 4, 6, 8, 10, 12, 14]);
    });

    it('array, callback', function () {
      var valueToVerify;
      // tests fail with anything but 0ms timeouts - why?
      sequenceTimeout([1, 2, 3, 4, 5, 6, 7], function (count) {
        return count * 2;
      }).then(function(all) {
        valueToVerify = all;
      });

      $timeout.flush();
      expect(valueToVerify).toEqual([2, 4, 6, 8, 10, 12, 14]);
    });

    it('arguments, callback, timeout', function () {
      var valueToVerify;
      // tests fail with anything but 0ms timeouts - why?
      sequenceTimeout(1, 2, 3, 4, 5, 6, 7, function (count) {
        return count * 2;
      }, 0).then(function(all) {
        valueToVerify = all;
      });

      $timeout.flush();
      expect(valueToVerify).toEqual([2, 4, 6, 8, 10, 12, 14]);
    });

    it('arguments, callback', function () {
      var valueToVerify;
      // tests fail with anything but 0ms timeouts - why?
      sequenceTimeout(1, 2, 3, 4, 5, 6, 7, function (count) {
        return count * 2;
      }).then(function(all) {
        valueToVerify = all;
      });

      $timeout.flush();
      expect(valueToVerify).toEqual([2, 4, 6, 8, 10, 12, 14]);
    });
  });
});
