/**
 * Module dependencies.
 */

var express = require('express'),
routes = require('./routes'),
user = require('./routes/user'),
http = require('http'),
path = require('path'),
fs = require('fs');

var app = express();

var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var logger = require('morgan');
var errorHandler = require('errorhandler');
var multipart = require('connect-multiparty')
var multipartMiddleware = multipart();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/style', express.static(path.join(__dirname, '/views/style')));

// development only
if ('development' == app.get('env')) {
	app.use(errorHandler());
}


var watson = require('watson-developer-cloud');



app.get('/', routes.index);

//credenciais de acesso ao serviço do Watson Conversation
var conversation = watson.conversation({
    username:'f810d044-db54-43fe-bb2b-afce0aa40450',//substitua pelo username do seu serviço
  password:'ZpJGzFqMkkoD',//substitua pelo password do seu serviço
  version: 'v1',
  version_date: '2016-07-11'
});


//Worskpace ID a ser mudado pelo seu Conversation
var workspace = 'ef1e1092-7db7-4c9f-b165-700fa5f53c5b';


app.post('/converse', function(req, res, next) {
  var payload = {
    workspace_id: workspace,
    context: {},
    input: {}
  };
  
  if (req.body) {
    if ( req.body.input ) {
      payload.input = {text: req.body.input};
    }
    if (req.body.context) {
      payload.context = req.body.context;
    }
  }else{
    payload = {};
      }
  conversation.message(payload, function(err, data){
    if ( err ) {
      console.log(err);
    }else{

       if(!data.output.text[0]){
         data.output.text[0] = resposta[data.intents[0].intent];
       }
      return res.json(data);
    }
  });

});


http.createServer(app).listen(app.get('port'), '0.0.0.0', function() {
	console.log('Express server listening on port ' + app.get('port'));
});

