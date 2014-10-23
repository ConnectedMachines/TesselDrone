'use strict';

describe('Motors', function(){
  it('confirms that Tessel is connected');
  it('confirms servo module is attached');
  it('confirms that ESC has power');
  it('Can reset the ESC');
  it('Sets ESC max PWM bound');
  it('Sets ESC min PWM bound');
  it('Arms ESC');
  it('Motor does not activate below min throttle');
  it('Motor does not activate above max throttle');
  it('Motor activates between min and max throttle');
  it('Motor responds to throttle increase');
  it('Motor responds to throttle decrease');
  it('Motor shuts off when throttle exceeds max (does this happen?)');
  it('Motor shuts off when throttle falls below the min');
  it('Motor responds to throttle changes as expected');
});