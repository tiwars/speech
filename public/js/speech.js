if(!window.webkitSpeechRecognition){
  $('.mic_div').attr("style", "display: none !important");
}
function handleClick(id){
	setClipboard(document.getElementById(id).innerHTML.trim().replace(/<br>/gm,'\n'));
}

function setClipboard(value) {
    var tempInput = document.createElement("textarea");
    tempInput.style = "position: absolute; left: -1000px; top: -1000px";
    tempInput.value = value;//'.replace(/<br>/gm,'\n');'
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand("copy");
    document.body.removeChild(tempInput);
}

function setClipboard2(node){
    var selection = getSelection();
    selection.removeAllRanges();
    var range=document.createRange();
    range.selectNodeContents(node);
    selection.addRange(range);
    document.execCommand("copy");
    selection.removeAllRanges()
}

var fileInput = document.querySelector('input[type="file"]');
fileInput.addEventListener('change', function (e) {
    var reader = new FileReader();
    reader.onload = function (e) {
        // initSound(this.result);
        $('.modal').modal('show');
        submitPost({'recording':bufferToBase64(this.result)});
    };
    reader.readAsArrayBuffer(this.files[0]);
}, false);


var bufferToBase64 = function (buffer) {
    var bytes = new Uint8Array(buffer);
    var len = buffer.byteLength;
    var binary = "";
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
};

function submitPost(data){

    $.ajax({

    url : '/',
    type : 'POST',
    data : data,
    dataType:'json',
    success : function(data) {         
         // console.log(data);
         $('#scribbedText').val(data.scribe);
         $('#saveText').prop('disabled', false);
         $('.modal').modal('hide');
        },
    error : function(request,error, data){
         $('#scribbedText').val(data.errorText);
         $('.modal').modal('hide');
        }
    });
}


function startTranscribing() {

    var that = this;
    if (window.hasOwnProperty('webkitSpeechRecognition')) {
     $('#mic').addClass("listening");


      var recognition = new webkitSpeechRecognition();

      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.lang = "en-US";
      recognition.start();

      recognition.onresult = function(e) {
        if(e.results[0][0].transcript.toLocaleLowerCase().indexOf("okay") === 0 && e.results[0][0].transcript.toLocaleLowerCase().indexOf("stop")){
            $('#mic').removeClass("listening");
            return;
        }
        $('#scribbedText').val($('#scribbedText').val() + " " + e.results[0][0].transcript)
        startTranscribing();
      };

      recognition.onerror = function(e) {
         $('#mic').removeClass("listening");
        recognition.stop();
      }

    }
  }
