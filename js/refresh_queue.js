$(document).ready(function() {
  $.get( "http://www.shaneschulte.com/queue/", function( data ) {
    console.log( "Data Loaded: " + data );
  });
});
