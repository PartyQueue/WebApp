/* Open */
$(document).ready(function() {

  // Search form submit handler
  $("#desktop-search-form").submit(function(e) {
    $("#desktop-search-bar").blur();
    e.preventDefault();
    var query = $("#desktop-search-bar").val();
    performDesktopSearch(query, true);
  });
});

function performDesktopSearch(query, stash) {
  $("#desktop-search-bar").val(query);
  $.ajax({
          url: 'https://api.spotify.com/v1/search',
          data: {
              q: query,
              type: 'track',
              market: spotify_country,
              limit: 50
          },
          success: function (response) {
              displayDesktopSearch(response);
              var stateObj = response;
              if(stash) history.pushState(stateObj, "Search results", "#/search/"+encodeURI(query));
              else history.replaceState(stateObj, "Search results", "#/search/"+encodeURI(query));
      }});
}

/* Search */
function displayDesktopSearch(response) {
  // Clear old results
  $('#desktop-results').html('<table class="tablesorter" id="track-table"><thead><tr><th class="thin">&nbsp;</th><th>SONG</th><th>ARTIST</th><th>ALBUM</th></tr></thead><tbody></tbody></table>');

  // Iterate results
  $.each(response.tracks.items, function(k,v) {

    // Build search entry object
    var $row = $("<tr>", {"id":v.id})
        .append($("<td>", {"class":"thin clickable"}).html('<i class="fa fa-plus"></i>'))
        .append($("<td>", {"class":"clickable"}).html(v.name))
        .append($("<td>").html(buildArtistStringWithLinks(v.artists)))
        .append($("<td>").html("<a title=\""+v.album.name+"\" href='#/album/"+v.album.id+"'>"+v.album.name+"</a>"));

    $("#track-table tbody").append($row);
  });
  // Set click listener (requests song on click)
  $("#track-table .clickable").click(function() {
    var that = $(this).closest("tr");
    that.hide("fast");
    var jqxhr = $.post("http://"+window.location.host+"/add", {'track': that.attr("id")}, function(data) {
      $.notify("Your song has been requested!", {className:"success", position:"bottom right"});
      that.remove();
    })
    .fail(function() {
      $.notify("Song request failed.", {className:"error", position:"bottom right"});
      that.show("slow");
    });
  });
  $("#track-table").tablesorter();
  // Display the results
  $("#desktop-results").append("<div class='iphone-spacer'></div>");
}
/* Close */
function closeDesktopSearch() {
    $("#desktop-search-bar").val('');
    $('#desktop-results').html('');
}
