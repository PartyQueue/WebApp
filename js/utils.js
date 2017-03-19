function buildArtistString(artists) {
  var artist_name = '';
  $.each(artists, function(art,ist) { artist_name += ist.name + ', '; });
  return artist_name.substring(0, artist_name.length-2);
}
