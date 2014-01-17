var express = require('express'),
  app = express(),
  fs = require('fs'),
  winston = require('winston');

if (!fs.existsSync('./logs')) {
  fs.mkdirSync('./logs');
  fs.createWriteStream('./logs/exceptions.log', {
    flags: 'a'
  });
  fs.createWriteStream('./logs/requests.log', {
    flags: 'a'
  });
} else {
  fs.createWriteStream('./logs/exceptions.log', {
    flags: 'a'
  });
  fs.createWriteStream('./logs/requests.log', {
    flags: 'a'
  });
}

app.use(express.compress());
app.use(express.bodyParser({
  limit: '1000mb',
  defer: true
}));
app.set('views', __dirname + '/public');
app.use('/public', express.static(__dirname + '/public'));
app.set('view engine', 'jade');
app.engine('jade', require('jade').__express);

var logger = new(winston.Logger)({});


logger.handleExceptions(new winston.transports.File({
  filename: './logs/exceptions.log',
  json: true
}));

var requestLogger = new(winston.Logger)({
  transports: [
    new(winston.transports.File)({
      filename: './logs/requests.log',
      json: false,
      timestamp: true
    })
  ]
}),
  winstonStream = {
    write: function(message, encoding) {
      requestLogger.info(message.replace(/(\r?\n)$/, ''));
    }
  };

app.use(express.logger({
  stream: winstonStream
}));


app.use(app.router);
winston.loggers.add('exceptions', {
  file: {
    filename: './logs/exceptions.log',
    json: true
  }
})

// 500: Error reporing
app.use(function(err, req, res, next) {
  winston.loggers.get('exceptions').log('error', "500. " + err.stack);
  res.json(500, {
    ERROR: 'Internal server error.'
  });
});

require('./lib/routes')(app);

app.listen(9001, function() {
  console.log('hackerView listening on port ' + 9001);
});