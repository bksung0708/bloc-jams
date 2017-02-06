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
         var songNumber = parseInt($(this).data('song-number'));
         
         if (currentlyPlayingSongNumber === null) {
             $(this).html(pauseButtonTemplate);
             setSong(songNumber);
             updatePlayerBarSong();
         }
         else if (currentlyPlayingSongNumber === songNumber) {
             $(this).html(playButtonTemplate);
             $('.main-controls .play-pause').html(playerBarPlayButton);
             currentlyPlayingSongNumber = null;
             currentSongFromAlbum = null;
         }
         else if (currentlyPlayingSongNumber !== songNumber) {
             var currentlyPlayingSongElement = getSongNumberCell(currentlyPlayingSongNumber);
             currentlyPlayingSongElement.html(currentlyPlayingSongNumber);
             $(this).html(pauseButtonTemplate);
             setSong(songNumber);
             updatePlayerBarSong();
         }
     };
 
     var onHover = function(event) {
         // Placeholder for function logic
         var songNumberCell = $(this).find('.song-item-number');
         var songNumber = parseInt(songNumberCell.data('song-number'));
         
             if(songNumber !== currentlyPlayingSongNumber) {
                songNumberCell.html(playButtonTemplate);
             }
     };
     var offHover = function(event) {
         // Placeholder for function logic
             var songNumberCell = $(this).find('.song-item-number');
             var songNumber = parseInt(songNumberCell.data('song-number'));
 
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

 var nextSong = function() {
     var songIndex = trackIndex(currentAlbum, currentSongFromAlbum);
     var lastSongNumber = currentlyPlayingSongNumber - 1;
     
     if (songIndex >= currentAlbum.songs.length - 1) {
         lastSongNumber = currentAlbum.songs.length;
         songIndex = 0;
         currentlyPlayingSongNumber = songIndex + 1;
     }
     else {
         if (lastSongNumber == currentAlbum.songs.length + 1) {
             lastSongNumber = currentlyPlayingSongNumber - 1;
         }
         else {
             lastSongNumber++;
         }
         songIndex++;
         currentlyPlayingSongNumber++;
     }
     
     currentSongFromAlbum = currentAlbum.songs[songIndex];
     updatePlayerBarSong();
     
     var previouslyPlayingSongElement = getSongNumberCell(lastSongNumber);
     previouslyPlayingSongElement.html(lastSongNumber);
     var currentlyPlayingSongElement = getSongNumberCell(currentlyPlayingSongNumber);
     currentlyPlayingSongElement.html(pauseButtonTemplate);
 };
 
 var previousSong = function () {
     var songIndex = trackIndex(currentAlbum, currentSongFromAlbum);
     var lastSongNumber = currentlyPlayingSongNumber + 1;
     
     if (songIndex <= 0) {
         lastSongNumber = 1;
         songIndex = currentAlbum.songs.length - 1;
         currentlyPlayingSongNumber = songIndex + 1;
     }
     else {
         if (lastSongNumber == currentAlbum.songs.length + 1) {
             lastSongNumber = currentlyPlayingSongNumber;
         }
         else {
             lastSongNumber--;
         }
         songIndex--;
         currentlyPlayingSongNumber--;
     }
     
     currentSongFromAlbum = currentAlbum.songs[songIndex];
     updatePlayerBarSong();
     
     var previouslyPlayingSongElement = getSongNumberCell(lastSongNumber);
     previouslyPlayingSongElement.html(lastSongNumber);
     var currentlyPlayingSongElement = getSongNumberCell(currentlyPlayingSongNumber);
     currentlyPlayingSongElement.html(pauseButtonTemplate);
 };

 var setSong = function(songNumber) {
     currentlyPlayingSongNumber = parseInt(songNumber);
     currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
 };

 var getSongNumberCell = function(number) {
     return $('.song-item-number[data-song-number="' + number + '"]');
 };

 var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
 var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
 var playerBarPlayButton = '<span class="ion-play"></span>';
 var playerBarPauseButton = '<span class="ion-pause"></span>';

 // Store state of playing songs
 var currentAlbum = null;
 var currentlyPlayingSongNumber = null;
 var currentSongFromAlbum = null;
 
 var $previousButton = $('.main-controls .previous');
 var $nextButton = $('.main-controls .next');

 $(document).ready(function() {
     setCurrentAlbum(albumPicasso);
     $previousButton.click(previousSong);
     $nextButton.click(nextSong);
 });

