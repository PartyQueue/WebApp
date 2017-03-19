function performArtistLookup(id, stash) {
  $.get('https://api.spotify.com/v1/artists/'+id+'/top-tracks?country='+spotify_country, function (response) {
    var topTracks = response;
    $.get('https://api.spotify.com/v1/artists/'+id+'/albums?album_type=album,single&limit=50&market='+spotify_country, function (response) {
      var albums = response;
      var stateObj = {"topTracks":topTracks, "albums":albums};
      console.log(stateObj);
      displayDesktopArtist(stateObj);
      if(stash) history.pushState(stateObj, "Search results", "#/artist/"+id);
      else history.replaceState(stateObj, "Search results", "#/artist/"+id);
    });
  });
}
function displayDesktopArtist(response) {
  $('#desktop-results').html("");
  $.each(response.topTracks.tracks, function(k,v) {
    $('#desktop-results').append(v.name+"<br>");
  });
  $.each(response.albums.items, function(k,v) {
    $('#desktop-results').append("<img src='"+v.images[2].url+"'/><br>");
  });
}
