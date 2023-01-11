let mumble = require('mumble')

var options = {
   
};

console.log( 'Connecting' );
mumble.connect( 'mumble://195.251.134.194:64739', options, function ( error, connection ) {
    if( error ) { throw new Error( error ); }

    console.log( 'Connected' );

    connection.authenticate( 'ExampleUser' );
    connection.on( 'initialized', onInit );
    connection.on( 'voice', onVoice );
});

var onInit = function() {
    console.log( 'Connection initialized' );

    // Connection is authenticated and usable.
};

var onVoice = function( voice ) {
    console.log( 'Mixed voice' );

    var pcmData = voice;
};