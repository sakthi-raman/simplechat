(function()
{
	var Chat		=	function(){};
	
	Chat.prototype	=	{
		
		init		:	function()
		{
			var _this	=	this;
			
			$('#chat_start').click(function(e)
			{
				e.preventDefault();
				
				var chat_uname	=	$('#chat_uname').val();
				
				if( ! chat_uname.length)
					return false;
				
				_this.initChat();
			});
		},
		
		initChat	:	function()
		{
			var socket	=	io.connect('http://localhost:8080/');
			
			socket.emit('add user', {uname : chat_uname});
			socket.on('user added', function(data)
			{
				console.info('User Added') + data.uname;
				$('#chat_start').hide();
				$('#chat_window').show();
				$('#chat_message').html(data.uname + ' is added').show();
			});
		}
	};
	
	window.Chat	=	new Chat();
})();