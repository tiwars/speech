
var Speech = function (data) {
this.data = data;
}

Speech.prototype.data = {}

Speech.prototype.get = function (text) {
return this.data[text];
}

Speech.prototype.set = function (text, value) {
this.data[text] = value;
}

module.exports = Speech;