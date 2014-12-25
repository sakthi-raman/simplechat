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
var users		=	[];
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
	console.info('Socket Connection');
	socket.on('add user', function(data)
	{
		console.info('Add user') + data.uname;
		++no_users;
		socket.uname	=	data.uname;
		users[no_users]	=	socket;
		
		socket.emit('user added', {uname : data.uname});
	});
});

http.listen(config.port);

console.info('Process running in http://localhost:'+config.port);