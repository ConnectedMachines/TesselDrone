// contains code related to sensors' params and methods. 

// Sensor Calibrations
var accelMaxGs = 2; // in g's, possible values: 2 4 8
var accelThresholdBeforeBalancing = 0.03;
var accelReadsPerSecond = 250;

var sensors = {
  accel: {calibrate: accelCalibrate},
  gyro: {calibrate: gyroCalibrate},
  magnetometer: {calibrate: magnetometerCalibrate},
  downSonar: {calibrate: downSonarCalibrate},
  turretSonar: {calibrate: turretSonarCalibrate}
};

accel.on('ready', function () {
  log('    Accel module ready');
  accel.setOutputRate( accelReadsPerSecond, function(err){
    accel.setScaleRange( accelMaxGs, function(err){
      isAccelModuleReady = true;
      if(isAccelModuleReady && isServoModuleReady){ 
        onModulesReady();
      }
    });
  });
});
