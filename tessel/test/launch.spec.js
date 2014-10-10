var proxyquireStrict = require('proxyquire').noCallThru();
var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;
var mainControlStub = {};
var stabilizeStub = {};

var launchFile = proxyquireStrict.load('../launch.js', {
  './mainControl.js' : mainControlStub,
  './stabilize.js' : stabilizeStub
});

describe('launch.js', function(){
  
  beforeEach(function(){
    mainControlStub.userReady = false;
  })

  describe('launch()', function(){

    it('should be a function', function(){
      assert.typeOf(launchFile.launch, 'function', 'launch is a function');
    });

  });
  
  describe('readyToLaunch()', function(){
    it('should be a function', function(){
      assert.typeOf(launchFile.readyToLaunch, 'function', 'readyToLaunch is a function');
    });

    it('should set mainControl.userReady to true when called', function(){
      expect(mainControlStub.userReady).to.be.false;
      launchFile.readyToLaunch();
      expect(mainControlStub.userReady).to.be.true;
    });

  });
  
  describe('checkIfReadyToLaunch()', function(){
    it('should be a function', function(){
      assert.typeOf(launchFile.checkIfReadyToLaunch, 'function', 'checkIfReadyToLaunch is a function');
    });
  });
});
