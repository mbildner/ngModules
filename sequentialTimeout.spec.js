describe('sequenceTimeout', function() {
  var _callablesTimeout, _sequenceTimeout;

  // bootstrap angular
  beforeEach(module('mbildner.timeout'));
  describe('some feature', function () {

    beforeEach(inject(function (callablesTimeout, sequenceTimeout) {

      _callablesTimeout = callablesTimeout;
      _sequenceTimeout = sequenceTimeout;

    }));

    it('should let me know whatsup', function () {
      expect(_callablesTimeout.isTestable).toBe('moshe bildner');
      expect(_sequenceTimeout.isTestable).toBe('moshe bildner also');
    });
  });
});
