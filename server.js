try
{
	if( ! process.argv[2])
		throw 'env is empty';
	
	var env		=	process.argv[2];
	var config	=	require('./config/app')(env);
	
	if( ! config.port)
		throw 'Env is invalid';
}
catch(e)
{
	console.log('Error : ' + e);
	return;
}

var express		=	require('express');
var app			=	express();

var http		=	require('http').Server(app);
var sockets		=	require('socket.io')(http);
var route		=	require('./config/route');
var util		=	require('./config/util');
//var users		=	[];
var no_users	=	0;

app
	.use(express.static(__dirname + '/public'))
	.engine('html', require('ejs').renderFile)
	.set('view engine', 'html')
	.set('title', 'Simple Chat')
	.set('views', __dirname + '/views')
	.get('/', route.home);

sockets.on('connection', function(socket)
{
	socket.is_typing	=	false;
	
	socket
		.on('add user', function(data)
		{
			if(typeof socket[data.uname] !== 'undefined')
				return;
			
			++no_users;
			socket.uname	=	data.uname;
			//users[no_users]	=	socket;

			socket.emit('user added', {uname : data.uname});
			socket.broadcast.emit('user joined', {uname : data.uname, no_users : no_users});
		})
		.on('send msg', function(data)
		{
			socket.emit('msg sent', {uname : socket.uname, msg : data.msg});
			socket.broadcast.emit('msg broadcast', {uname : socket.uname, msg : data.msg});
		})
		.on('user typing', function()
		{
			if(socket.is_typing)
				return;

			socket.is_typing	=	true;

			socket.broadcast.emit('user typing', {uname : socket.uname});
		})
		.on('user typing blur', function()
		{
			socket.is_typing	=	false;
			socket.broadcast.emit('user typed', {uname : socket.uname});
		})
		.on('disconnect', function()
		{
			--no_users;
			socket.broadcast.emit('user disconnected', {uname : socket.uname});
		});
});

http.listen(config.port);

console.info('Process running in http://localhost:'+config.port);