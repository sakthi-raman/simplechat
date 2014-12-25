module.exports	=	function(env)
{
	var config	=	{};
	
	switch(env)
	{
		case 'dev':
			config['host']	=	'sample';
			config['port']	=	'8080';
		break;
		
		default:
			config['host']	=	'sample123';
			config['port']	=	'8081';
		break;
	}
	
	return config;
};