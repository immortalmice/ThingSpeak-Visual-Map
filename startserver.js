//Setting & Require
var express = require('express');
var app = express();

//Callback Function

var sendresponse = function(response, errinfo){
	response.writeHead(200);
	response.write(errinfo);
	response.end();
}
var to_index = function(request, response){
	console.log('A request is now redirecting.');
	response.redirect('index.html');
};

//Set Server

app.use(express.static(__dirname + '/'));

app.get('/', to_index);

app.listen(80, function(){
 	console.log("HTTP server listening on port 80.");
});
//get_data_from_thingspeak();
