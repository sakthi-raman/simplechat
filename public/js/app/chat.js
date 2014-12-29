(function()
{
	var Chat		=	function(){};
	
	Chat.prototype	=	{
		
		uname		:	'',

		host		:	'',
		
		is_joined	:	false,
		
		init		:	function(host)
		{
			var _this	=	this;
			Chat.host	=	host;
			
			$('#chat_start').click(function(e)
			{
				e.preventDefault();
				
				var chat_uname	=	$('#chat_uname').val();
				
				if( ! chat_uname.length)
					return false;
				
				_this.uname	=	chat_uname;
				_this.initChat();
			});
		},
		
		postMsg		:	function(msg, fn, isClean)
		{
			var chart_msg	=	$('#chat_message');
			msg				=	'<li>'+msg+'</li>';
			
			if(typeof isClean === 'undefined')
				chart_msg.append(msg);
			else
				chart_msg.html(msg);
			
			if(typeof fn === 'function')
				fn();
		},
		
		initChat	:	function()
		{
			var _this	=	this;
			var socket	=	io.connect(Chat.host);
			
			socket
				.emit('add user', {uname : _this.uname})
				.on('user added', function(data)
				{
					$('#chart_info').hide();
					$('#chat_window').show();
					
					_this.postMsg(data.uname + ' is joined', function()
					{
						Chat.is_joined	=	true;
						$('#chat_message').show();
					}, true);
				})
				.on('user joined', function(data) //Broadcast event
				{
					if( ! Chat.is_joined)
						return;
					
					_this.postMsg(data.uname + ' joined in the chat');
				})
				.on('user typing', function(data) //Broadcast event
				{
					if($('#typing_'+data.uname).length)
						return;
					
					_this.postMsg(data.uname + ' typing', function()
					{
						$('#chat_message li:last').attr('id', 'typing_'+data.uname);
					});
				})
				.on('user typed', function(data) //Broadcast event
				{
					var obj	=	$('#typing_'+data.uname);
					
					if(obj.length)
						obj.remove();
				})
				.on('msg sent', function(data)
				{
					_this.postMsg(data.uname + ' : ' + data.msg);
				})
				.on('msg broadcast', function(data) //Broadcast event
				{
					_this.postMsg(data.uname + ' : ' + data.msg);
				})
				.on('user disconnected', function(data) //Broadcast event
				{
					_this.postMsg(data.uname + ' left the chat');
				});
			
			$('#chat_msg')
				.on('keyup keydown', function()
				{
					socket.emit('user typing');
				})
				.on('blur', function()
				{
					$('li.typing_'+_this.uname).remove();
					socket.emit('user typing blur');
				});
			
			$('#chat_send').click(function()
			{
				var msg	=	$.trim($('#chat_msg').val());
				
				if(msg.length)
					socket.emit('send msg', {msg : msg});
				
				$('#chat_msg').val('');
			});
		}
	};
	
	window.Chat	=	new Chat();
})();