$(document).ready(function() {
  $.get( "http://www.shaneschulte.com/queue/", function( data ) {
    var result = JSON.parse(data);
    if(result.length >= 1) {
      var now_playing = result.shift();
      console.log(now_playing);
    }
  });
});
