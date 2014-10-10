var proxyquireStrict = require('proxyquire').noCallThru();
var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;
var sinon = require("sinon");
var sinonChai = require("sinon-chai");
var mainControlStub = {};
mainControlStub.motors = {};

chai.should();
chai.use(sinonChai);

var landFile = proxyquireStrict.load('../land.js', {
  './mainControl.js' : mainControlStub
});

var Motor = function(number){
  this.number = number;
  this.currentThrottle = 0;
  this.setThrottle = function(throttle){
    this.currentThrottle = throttle;
  };
};

describe('The land.js file', function(){
  
  beforeEach(function(){
    mainControlStub.isLanding = false;
    mainControlStub.isHovering = true;
    mainControlStub.motors[1] = new Motor(1);
    mainControlStub.motors[2] = new Motor(1);
    mainControlStub.motors[3] = new Motor(1);
    mainControlStub.motors[4] = new Motor(1);
  })

  describe('land', function(){

    it('should be a function', function(){
      assert.typeOf(landFile.land, 'function', 'land is a function');
    });

    it('should set isLanding to true and isHovering to false when called', function(){
      landFile.land();
      expect(mainControlStub.isLanding).to.equal(true);
      expect(mainControlStub.isHovering).to.equal(false);
    });

    it('should call setThrottle on all motors', function(){
      var spy1 = sinon.spy(mainControlStub.motors[1], 'setThrottle');
      var spy2 = sinon.spy(mainControlStub.motors[2], 'setThrottle');
      var spy3 = sinon.spy(mainControlStub.motors[3], 'setThrottle');
      var spy4 = sinon.spy(mainControlStub.motors[4], 'setThrottle');
      landFile.land();
      spy1.should.have.been.called;
      spy2.should.have.been.called;
      spy3.should.have.been.called;
      spy4.should.have.been.called;
    });

      it('should set all motors throttle to 0', function(){
        mainControlStub.motors[1].currentThrottle = 0.1
        mainControlStub.motors[2].currentThrottle = 0.1
        mainControlStub.motors[3].currentThrottle = 0.1
        mainControlStub.motors[4].currentThrottle = 0.1  
        expect(mainControlStub.motors[1].currentThrottle).to.equal(0.1)
        expect(mainControlStub.motors[2].currentThrottle).to.equal(0.1)
        expect(mainControlStub.motors[3].currentThrottle).to.equal(0.1)
        expect(mainControlStub.motors[4].currentThrottle).to.equal(0.1)         
        landFile.land();
        expect(mainControlStub.motors[1].currentThrottle).to.equal(0)
        expect(mainControlStub.motors[2].currentThrottle).to.equal(0)
        expect(mainControlStub.motors[3].currentThrottle).to.equal(0)
        expect(mainControlStub.motors[4].currentThrottle).to.equal(0)
      });
  });
  
});
