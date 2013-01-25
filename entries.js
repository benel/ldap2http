var ldap = require('ldapjs');
var http = require('http');
var fs = require('fs');

var conf = JSON.parse(
  fs.readFileSync('config.json', 'utf8')
);  

http.createServer(function (req, res) {
  
  res.writeHead(200, {'Content-Type': 'application/json'});
  
  var client = ldap.createClient(conf.connection);

  var result =[];

  client.search(conf.base, conf.searchOptions, function(err, response) {
  	response.on('searchEntry', function(entry) {
  	  result.push(entry.object.displayName);
  	});
  	response.on('error', function(err) {
      console.error('error: ' + err.message);
  	});
  	response.on('end', function(response) {
  	  result.sort();
  	  res.write(JSON.stringify(result));
      res.end();
  	});
  });

}).listen(conf.port);

console.log('Server running port ' + conf.port.toString() + '\n');