/**
 * @constructor
 */
function audioAnalysisSanitizer(sound, feature, decay) {
  this.sound = sound;
  this.feature = feature;
  this.decay = decay;
  this.currentValue = 0;
  this.currentFrame = -1;
}

audioAnalysisSanitizer.prototype.getValue = function(frame) {
  if (frame === this.currentFrame) {
    return this.currentValue;
  }
  this.currentFrame = frame;
  var value = window.audioAnalysis[this.sound][this.feature][frame];
  this.currentValue -= this.decay;
  if (value > this.currentValue) {
    this.currentValue = value;
  }
  return this.currentValue;
};
