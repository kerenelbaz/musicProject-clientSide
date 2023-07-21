const apiKey = 'd213eba8760d06561048ca7e571dcce2';
$.ajax({
    url: 'http://ws.audioscrobbler.com/2.0/',
    method: 'GET',
    data: {
      method: 'artist.getinfo',
      artist: "ABBA",
      api_key: apiKey,
      format: 'json'
    },
    success: function(response) {
      // Log the response data to the console
      console.log(response);
    },
    error: function(error) {
      // Handle the error
      console.error(error);
    }
})
