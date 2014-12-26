/**
* @description Module and archives used by the server
* @author Adrián Sánchez <asanchez@technergycr.com>
*/

var template_engine = 'dust';

var express = require('express'),
    winston = require('winston'),
    cronJob = require('cron').CronJob,
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    cookieSession = require('cookie-session'),
	nodemailer = require('nodemailer');
 
var app = express();

var transporter  = nodemailer.createTransport({
   service: 'Gmail',  // sets automatically host, port and connection security settings
   auth: {
       user: 'adriansanchez.logn@gmail.com',
       pass: 'Technergy14AMSS'
   },
   tls: {
       rejectUnauthorized: false
   }
});
 
//app.configure(function () {
    app.use(express.logger('dev'));     /* 'default', 'short', 'tiny', 'dev' */
    app.use(bodyParser());
    //app.use('/public', express.static(__dirname + '/eshopper/app'));
    //app.use('/admin', express.static(__dirname + '/admin/app'));
    app.use(express.static(__dirname));
//});


if ( template_engine == 'dust' ) {
    var dust = require('dustjs-linkedin'),
        cons = require('consolidate');
    app.engine('dust', cons.dust);
} 


/*
Seconds: 0-59
Minutes: 0-59
Hours: 0-23
Day of Month: 1-31
Months: 0-11
Day of Week: 0-6*/
new cronJob('0 0 9 * * *', function(){
        //mail.sendAuto();
        console.log('Birthday Job runned');
    }, null, true, null);


var logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({ json: false, timestamp: true }),
    new winston.transports.File({ filename: __dirname + '/debug.log', json: false })
  ],
  exceptionHandlers: [
    new (winston.transports.Console)({ json: false, timestamp: true }),
    new winston.transports.File({ filename: __dirname + '/exceptions.log', json: false })
  ],
  exitOnError: false
});

module.exports.logger = logger;



app.post('/email', function (req, res) {
    var fecha = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
    mailOptions = {
		to: 'asanchez@technergycr.com', // receiver
		 subject: 'Technergy: Desde la pagina web - Fecha: ' + fecha, // subject
		 text: 'Correo: ' + req.body['email'] + '. \n'+ 'Nombre: ' + req.body['name'] + '. \n' + 'Texto: ' + req.body['text'] // body
		 };
	transporter.sendMail(mailOptions, function(error, info){
		if(error){
			console.log(error);
		}else{
			console.log('Message sent: ' + info.response);
		}
	});
	console.log(req.body);
});



app.get('*', function (req, res) {
    res.redirect('../#home', 404);
});

// Listening port
var port = Number(process.env.PORT || 9000);
app.listen(port);
console.log('Listening on port ' + port + '...');
