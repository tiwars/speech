var atob = require('atob');
const {Storage} = require('@google-cloud/storage');
const speech = require('@google-cloud/speech');
const client = new speech.SpeechClient();
const storage = new Storage();
var file = storage.bucket('test-speech-poc').file("voice.amr");
// var file = 

function base64ToBuffer(){
    var binary = atob(buffer);
    var buffer = new ArrayBuffer(binary.length);
    var bytes = new Uint8Array(buffer);
    for (var i = 0; i < buffer.byteLength; i++) {
        bytes[i] = binary.charCodeAt(i) & 0xFF;
    }
    return buffer;
}

function uploadToGoogleCloud(data, successCallBack, errorCallback){
	console.log("uploading file");
	// var file = myBucket.file("voice.amr");
	var buff = Buffer.from(data, 'binary').toString('utf-8');

	const stream = file.createWriteStream({
		metadata: {
			contentType: 'audio/amr'
		}
	});
	stream.on('error', (err) => {
		errorCallback();
	});
	stream.on('finish', () => {
		successCallBack();
	});
	stream.end(new Buffer(buff, 'base64'));

}

function deleteFromGoogleCloud(){

  file
  .delete()
  .then(() => {
    console.log('gs://test-speech-poc/voice.amr deleted successfully');
  })
  .catch(err => {
    console.error('ERROR:', err);
  });

}

function fetchTextFromGoogleCloud(successCallBack, errorCallback){
const gcsUri = 'gs://test-speech-poc/voice.amr';
const encoding = 'AMR';
const sampleRateHertz = 8000;
const languageCode = 'en-US';

const config = {
  encoding: encoding,
  sampleRateHertz: sampleRateHertz,
  languageCode: languageCode,
};

const audio = {
  uri: gcsUri,
};

const request = {
  config: config,
  audio: audio,
};
console.log("in utils fetching text");
// Detects speech in the audio file. This creates a recognition job that you
// can wait for now, or get its result later.
client.longRunningRecognize(request).then(data => {
      const response = data[0];
      const operation = response;
      // Get a Promise representation of the final result of the job
      return operation.promise();
    })
    .then(data => {
      const response = data[0];
      const transcription = response.results
        .map(result => result.alternatives[0].transcript)
        .join('\n');
        console.log(`in Util Transcription: ${transcription}`);
      successCallBack(transcription);
    })
    .catch(err => {
      console.error('ERROR:', err);
      errorCallback(err);
    });

}
module.exports.base64ToBuffer = base64ToBuffer;
module.exports.fetchTextFromGoogleCloud = fetchTextFromGoogleCloud;
module.exports.uploadToGoogleCloud = uploadToGoogleCloud;
module.exports.deleteFromGoogleCloud = deleteFromGoogleCloud;