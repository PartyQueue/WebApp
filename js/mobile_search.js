/* Open */
$(document).ready(function() {

  // Search form submit handler
  $("#mobile-search-form").submit(function(e) {
    $("#mobile-search-bar").blur();
    e.preventDefault();
    var query = $("#mobile-search-bar").val();
    performMobileSearch(query, true);
  });
});

/* Search */
function performMobileSearch(query, stash) {
  $.ajax({
          url: 'https://api.spotify.com/v1/search',
          data: {
              q: query,
              type: 'track'
          },
          success: function (response) {
              displayMobileSearch(response);
              var stateObj = response;
              if(stash) history.pushState(stateObj, "", "#/msearch/"+encodeURI(query));
              //else history.replaceState(stateObj, "Search results", "#/msearch/"+encodeURI(query));
      }});
}

function displayMobileSearch(response) {
  // Clear old results
  $('#mobile-results').html('');

  // Iterate results
  $.each(response.tracks.items, function(k,v) {

    // Build search entry object
    $("#original .song").html(v.name);
    $("#original .artist").html(buildArtistString(v.artists));
    $("#original .album").attr("src", v.album.images[2].url);
    $("#original").clone().removeClass("hidden-xs-up").attr("id",v.id).appendTo("#mobile-results");

    // Set click listener (requests song on click)
    $("#"+v.id).click(function() {
      var that = $(this);
      requestSong(that);
    });
  });

  // Display the results
  $("#mobile-results").append("<div class='iphone-spacer'></div>");
  $(".closebtn").removeClass("hidden-xs-up");
  document.getElementById("mobile-search").style.height = "100vh";
}
/* Close */
function closeMobileSearch() {
    $("#mobile-search-bar").val('');
    $(".closebtn").addClass("hidden-xs-up");
    document.getElementById("mobile-search").style.height = "0vh";
    $('#mobile-results').html('');
}
