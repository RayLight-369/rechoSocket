const https = require( "http" );
const express = require( "express" );
const cors = require( "cors" );
const app = express();
const server = https.createServer( app );
const SocketIO = require( "socket.io" );
const io = new SocketIO.Server( server, {
  cors: {
    origin: "http://localhost:3002"
  }
} );
const PORT = 5261;


app.use( cors() );


app.get( "/", ( _, res ) => {
  res.send( "Hello, world!" );
} );

io.on( "connection", ( socket ) => {
  // console.log( socket.id, " connected!" );
  socket.emit( "connection", { msg: "connected" } );

  socket.on( "newConnection", ( data ) => {
    console.log( "data: ", data );
    socket.id = data.id;
  } );

  socket.on( "join_teams", ( teams ) => {
    socket.join( teams );
    console.log( `${ socket.id } has joined `, teams );
  } );

  socket.on( "member_join", ( { teamID, memberID } ) => {
    console.log( `${ socket.id } (${ memberID }) has joined `, teamID );
    socket.to( teamID ).emit( "client_member_join", { memberID } );
  } );

  socket.on( "disconnect", () => {
    console.log( socket.id, " disconnected!" );
  } );
} );




io.listen( PORT );

// server.listen( PORT, () => console.log( `running on port ${ PORT }` ) );