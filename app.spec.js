'use strict';

describe('MadProps', function(){
  it('is awesome', function(){
    expect(true).toBe(true);
  });
  it('is pending');
  it('is pending', function(){
    pending();
  });
  xit('is also pending', function(){});

  it('equals 3', function(){
    expect(testableFunction()).toBe(3);
  });

});
