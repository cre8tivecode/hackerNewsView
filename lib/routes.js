var request = require('request');
module.exports = function(app) {
    app.get('/', function(req, res) {
        request('http://api.ihackernews.com/page', function(error, response, news) {
            if (!error && response.statusCode == 200) {
                news = JSON.parse(news);
                res.render('view.jade', {
                    data: news.items
                });
                res.end();
            }
        });
    });
}