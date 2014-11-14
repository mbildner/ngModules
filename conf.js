exports.config = {
  seleniumAddress: 'http://localhost:4444/wd/hub',
  specs: ['sequentialTimeout.spec.js'],
  capabilities: {
    browserName: 'chrome'
  }
}
