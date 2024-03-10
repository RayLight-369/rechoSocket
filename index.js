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
  socket.emit( "connection", { msg: "connected" } );

  socket.on( "newConnection", ( data ) => {
    console.log( "data: ", data );
  } );

  socket.on( "join_teams", ( teams ) => {
    const TEAMS = teams.map( team => team.id.toString() );

    socket.join( TEAMS );
    console.log( `${ socket.id } has joined `, TEAMS );

    io.to( TEAMS ).emit( "client_member_presence", { id: socket.id, TEAMS } );

    // console.log( "rooms: ", io.sockets.adapter.rooms );
  } );


  socket.on( "member_join", ( { teamID, memberID } ) => {
    console.log( `${ socket.id } (${ memberID }) has joined `, teamID );
    socket.broadcast.to( teamID.toString() ).emit( "client_member_join", { memberID } );

  } );

  socket.on( "disconnect", () => {
    console.log( socket.id, " disconnected!" );
  } );
} );

// io.on( "m", msg => {
//   console.log( `hahahahahahhaha: `, msg );
// } );

// io.on( "test", msg => {
//   console.log( `io test: `, msg );
// } );



io.listen( PORT );

// server.listen( PORT, () => console.log( `running on port ${ PORT }` ) );