 var createSongRow = function(songNumber, songName, songLength) {
     var template =
        '<tr class="album-view-song-item">'
      + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
      + '  <td class="song-item-title">' + songName + '</td>'
      + '  <td class="song-item-duration">' + songLength + '</td>'
      + '</tr>'
      ;
 
     var $row = $(template);
     
     var clickHandler = function() {
         // clickHandler logic
         var songNumber = $(this).data('song-number');
         currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
         
         if (currentlyPlayingSongNumber === null) {
             $(this).html(pauseButtonTemplate);
             currentlyPlayingSongNumber = songNumber;
             updatePlayerBarSong();
         }
         else if (currentlyPlayingSongNumber === songNumber) {
             $(this).html(playButtonTemplate);
             $('.main-controls .play-pause').html(playerBarPlayButton);
             currentlyPlayingSongNumber = null;
             currentSongFromAlbum = null;
         }
         else if (currentlyPlayingSongNumber !== songNumber) {
             var currentlyPlayingSongElement = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
             currentlyPlayingSongElement.html(currentlyPlayingSongNumber);
             $(this).html(pauseButtonTemplate);
             currentlyPlayingSongNumber = songNumber;
             updatePlayerBarSong();
         }
     };
 
     var onHover = function(event) {
         // Placeholder for function logic
         var songNumberCell = $(this).find('.song-item-number');
         var songNumber = songNumberCell.data('song-number');
         
             if(songNumber !== currentlyPlayingSongNumber) {
                songNumberCell.html(playButtonTemplate);
             }
     };
     var offHover = function(event) {
         // Placeholder for function logic
             var songNumberCell = $(this).find('.song-item-number');
             var songNumber = songNumberCell.data('song-number');
 
             if (songNumber !== currentlyPlayingSongNumber) {
                 songNumberCell.html(songNumber);
             }
     };
 
     $row.find('.song-item-number').click(clickHandler);
     $row.hover(onHover, offHover);
     return $row;
 };

 var setCurrentAlbum = function(album) {
     // #1
     currentAlbum = album;
     var $albumTitle = $('.album-view-title');
     var $albumArtist = $('.album-view-artist');
     var $albumReleaseInfo = $('.album-view-release-info');
     var $albumImage = $('.album-cover-art');
     var $albumSongList = $('.album-view-song-list');
 
     // #2
     $albumTitle.text(album.title);
     $albumArtist.text(album.artist);
     $albumReleaseInfo.text(album.year + ' ' + album.label);
     $albumImage.attr('src', album.albumArtUrl);
 
     // #3
     $albumSongList.empty();
 
     // #4
     for (var i = 0; i < album.songs.length; i++) {
         var $newRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
         $albumSongList.append($newRow);
     }
 };

 var trackIndex = function(album, song) {
     return album.songs.indexOf(song);
 };

 var updatePlayerBarSong = function() {
     $('.currently-playing .song-name').text(currentSongFromAlbum.title);
     $('.currently-playing .artist-name').text(currentAlbum.artist);
     $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + ' - ' + currentAlbum.artist);
     $('.main-controls .play-pause').html(playerBarPauseButton);
 };

 var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
 var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
 var playerBarPlayButton = '<span class="ion-play"></span>';
 var playerBarPauseButton = '<span class="ion-pause"></span>';

 // Store state of playing songs
 var currentAlbum = null;
 var currentlyPlayingSongNumber = null;
 var currentSongFromAlbum = null;


 $(document).ready(function() {
     setCurrentAlbum(albumPicasso);
 });

