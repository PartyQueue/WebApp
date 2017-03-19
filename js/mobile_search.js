/* Open */
$(document).ready(function() {

  // Search form submit handler
  $("#mobile-search-form").submit(function(e) {
    $("#mobile-search-bar").blur();
    e.preventDefault();
    var query = $("#mobile-search-bar").val();
    $.ajax({
            url: 'https://api.spotify.com/v1/search',
            data: {
                q: query,
                type: 'track'
            },
            success: function (response) {
                displayMobileSearch(response);
                var stateObj = response;
                history.pushState(stateObj, "Search results", "#/msearch/"+encodeURI(query))
        }});
  });
});
/* Search */
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
      that.hide("fast");
      var jqxhr = $.post("http://"+window.location.host+"/add", {'track': $(this).attr("id")}, function(data) {
        $.notify("Your song has been requested!", {className:"success", position:"bottom right"});
        that.remove();
      })
      .fail(function() {
        $.notify("Song request failed.", {className:"error", position:"bottom right"});
        that.show("slow");
      });
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
}
