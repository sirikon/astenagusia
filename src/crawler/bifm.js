var Crawler = require('crawler');

var c = new Crawler({
	maxConnections : 1,
	callback : function (error, res, done) {
		if(error){
			console.log(error);
		}else{
			var $ = res.$;
			console.log($('#content-main').html());
		}
		done();
	}
});

c.queue('http://www.bifmradio.com/musica/aste-nagusia-conciertos-2018/');
