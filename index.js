const https = require( "http" );
const express = require( "express" );
const app = express();
const server = https.createServer( app );
const SocketIO = require( "socket.io" );
const io = new SocketIO.Server( server );
const PORT = 5261;

io.on( "connection", ( socket ) => {
  console.log( socket.id, " connected!" );
} );




server.listen( PORT, () => console.log( `running on port ${ PORT }` ) );