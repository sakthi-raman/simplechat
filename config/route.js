module.exports	=	(function()
{
	return {
		home	:	function(req, resp)
		{
			resp.render('index/index', function(err, html)
			{
				if(err)
					console.info('error = ' + err);
				else
					resp.send(html).end();
			});
		}
	};
})();