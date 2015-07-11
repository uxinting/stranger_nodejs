/**
 * Server for web
 */
var fs = require('fs')
var url = require('url')
var path = require('path')
var http = require('http')

var mime = require('mime').types
var about = require('about')

function HttpServerUrlDispatch( req, res ) {
    var pathname = url.parse( req.url ).pathname;
    var args = url.parse( req.url, true ).query;

    switch( pathname ) {
	case '/about':
	    about.write( 'files/about.dat', args.msg );
	    res.writeHead( 200 );
	    res.end();
	break;
	default:
	    console.log( pathname );
	break;
    }
}

function HttpServerStaticDispatch( req, res, contentType ) {
    fs.readFile("." + req.url, 'binary', function (err, data) {
	if ( err ) {
	    res.writeHead( 500, { "Content-Type": 'text/plain' } );
	    res.end( err );
	} else {
	    res.writeHead( 200, { "Content-Type": contentType });
	    res.write(data, "binary");
	    res.end();
	}
    });
}

function HttpServerFunc( req, res ) {
    var pathname = url.parse( req.url ).pathname;
    var ext = path.extname( pathname );
    ext = ext ? ext.slice( 1 ) : 'unknown';
    var contentType = mime[ext] || "text/plain";

    switch ( ext ) {
	case 'unknown':
	    HttpServerUrlDispatch( req, res );
	break;
	default:
	    HttpServerStaticDispatch( req, res, contentType );
	break;
    }
}
http.createServer( HttpServerFunc ).listen( 8081 );
//End

/**
 * Server for websocket
 */
function toJson( from, msg ) {
    return '{"from":"' + from + '","msg":"' + msg + '"}';
}

var WebSocketServer = require('ws').Server , wss = new WebSocketServer({port: 8080});
var clients = [];
wss.on('connection', function(ws) {
    if ( clients.length == 0 ) {
	clients.push( ws );
    } else {
	ws.you = clients.shift();
	ws.you.you = ws;

	ws.send( toJson( 'server', 'you' ) );
	ws.you.send( toJson( 'server', 'you' ) );
    }

    ws.on('message', function(message) {
	ws.send( toJson( 'me', message ) );
	
	if ( ws.you != 'undefined' )
	    ws.you.send( toJson( 'you', message ) );
    });

    ws.on('close', function(e) {
	    ws.you.close();
    });
});
//End
