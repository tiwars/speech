var socket = io.connect('http://localhost:3000');
// socket.emit('dpUpdate',{});
socket.on('refresh', reloadPage);
function reloadPage(){
	console.log("received socket event ..handle your events here");
}
