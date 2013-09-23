//SERVER CODE

//------------------------------------------------------
//NodeJS code
var http = require('http');
var socketIO = require('socket.io');
var port = process.env.PORT || 5000;
var ip = process.env.IP || '127.0.0.1';

var server = http.createServer(function (req, res) {
	res.writeHead(200, {'Content-Type': 'text/plain'});
	res.end('Chatgroup application\n' + ip + ':' + port);
}).listen(port, ip, function() {
	console.log('Socket.IO server started at %s:%d', ip, port);
});


//Socket.IO code
var io = socketIO.listen(server);

//assuming io is the Socket.IO server object
io.configure(function () { 
  	io.set("transports", ["xhr-polling"]); 
  	io.set("polling duration", 10); 
});

io.set('match origin protocol', true);
io.set('origins', '*:*');
io.set('log level', 1);

var run = function(socket){
	// Socket process here!!!
	socket.emit('greeting', 'Hello from Socket.IO server');

	// 'user-join' event handler here
	socket.on('user-join', function(data){
		console.log('User %s have joined', data);
		socket.broadcast.emit('new-user', data);
	});

	socket.on('msg', function(data) {
		console.log(data.username + ': ' + data.msg);
		io.sockets.emit('msg', data);
	});
}

io.sockets.on('connection', run);
