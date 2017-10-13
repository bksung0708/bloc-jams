 var createSongRow = function(songNumber, songName, songLength) {
     var template =
        '<tr class="album-view-song-item">'
      + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
      + '  <td class="song-item-title">' + songName + '</td>'
      + '  <td class="song-item-duration">' + filterTimeCode(songLength) + '</td>'
      + '</tr>'
      ;

     var $row = $(template);

     var clickHandler = function() {
         // clickHandler logic
         var songNumber = parseInt($(this).data('song-number'));

         if (currentlyPlayingSongNumber === null) {
             $(this).html(pauseButtonTemplate);
             setSong(songNumber);
             currentSoundFile.play();
             updateSeekBarWhileSongPlays();
             updatePlayerBarSong();

             var volumeFill = $('.volume .fill');
             var volumeThumb = $('.volume .thumb');
             volumeFill.width(currentVolume);
             volumeThumb.css({left: currentVolume + '%'});
         }
         else if (currentlyPlayingSongNumber === songNumber) {
             if (currentSoundFile.isPaused()) {
                 $(this).html(pauseButtonTemplate);
                 $('.main--controls .play-pause').html(playerBarPauseButton);
                 currentSoundFile.play();
             }
             else {
                 $(this).html(playButtonTemplate);
                 $('.main-controls .play-pause').html(playerBarPlayButton);
                 currentSoundFile.pause();
             }
         }
         else if (currentlyPlayingSongNumber !== songNumber) {
             var currentlyPlayingSongElement = getSongNumberCell(currentlyPlayingSongNumber);
             currentlyPlayingSongElement.html(currentlyPlayingSongNumber);
             $(this).html(pauseButtonTemplate);
             setSong(songNumber);
             currentSoundFile.play();
             updateSeekBarWhileSongPlays();
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

 var updateSeekBarWhileSongPlays = function() {
     if (currentSoundFile) {
         // #10
         currentSoundFile.bind('timeupdate', function(event) {
             // #11
             var seekBarFillRatio = this.getTime() / this.getDuration();
             var $seekBar = $('.seek-control .seek-bar');
             setCurrentTimeInPlayerBar(this.getTime());


             updateSeekPercentage($seekBar, seekBarFillRatio);
         });
     }
 };

 var updateSeekPercentage = function($seekBar, seekBarFillRatio) {
    var offsetXPercent = seekBarFillRatio * 100;
    // #1
    offsetXPercent = Math.max(0, offsetXPercent);
    offsetXPercent = Math.min(100, offsetXPercent);

    // #2
    var percentageString = offsetXPercent + '%';
    $seekBar.find('.fill').width(percentageString);
    $seekBar.find('.thumb').css({left: percentageString});
 };

 var setupSeekBars = function() {

     var $seekBars = $('.player-bar .seek-bar');

     $seekBars.click(function(event) {
         // #3
         var offsetX = event.pageX - $(this).offset().left;
         var barWidth = $(this).width();
         // #4
         var seekBarFillRatio = offsetX / barWidth;

         // #5
         updateSeekPercentage($(this), seekBarFillRatio);
         if ($(this).parent().hasClass('seek-control')) {
             seek(seekBarFillRatio * currentSoundFile.getDuration());
         } else {
             setVolume(seekBarFillRatio * 100);
         }
     });
         // #7
     $seekBars.find('.thumb').mousedown(function(event) {
         // #8
         var $seekBar = $(this).parent();

         // #9
         $(document).bind('mousemove.thumb', function(event){
             var offsetX = event.pageX - $seekBar.offset().left;
             var barWidth = $seekBar.width();
             var seekBarFillRatio = offsetX / barWidth;

             updateSeekPercentage($seekBar, seekBarFillRatio);
             if ($seekBar.parent().hasClass('seek-control')) {
                 seek(seekBarFillRatio * currentSoundFile.getDuration());
             } else {
                 setVolume(seekBarFillRatio * 100);
             }
         });

         // #10
         $(document).bind('mouseup.thumb', function() {
             $(document).unbind('mousemove.thumb');
             $(document).unbind('mouseup.thumb');
         });
     });
 };

 var setCurrentTimeInPlayerBar = function(currentTime) {
     $('.current-time').text(filterTimeCode(currentTime));
 };

 var setTotalTimeInPlayerBar = function(totalTime) {
     $('.total-time').text(filterTimeCode(totalTime));
 };

 var filterTimeCode = function(timeInSeconds) {
     var secondsInNumberForm = parseFloat(timeInSeconds);
     var wholeMinute = Math.floor(secondsInNumberForm / 60);
     var wholeSecond = Math.floor(secondsInNumberForm - (wholeMinute * 60));
     if (wholeSecond < 10) {
         wholeSecond = '0' + wholeSecond;
     }
     return (wholeMinute + ":" + wholeSecond);
 };

 var trackIndex = function(album, song) {
     return album.songs.indexOf(song);
 };

 var updatePlayerBarSong = function() {
     $('.currently-playing .song-name').text(currentSongFromAlbum.title);
     $('.currently-playing .artist-name').text(currentAlbum.artist);
     $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + ' - ' + currentAlbum.artist);
     $('.main-controls .play-pause').html(playerBarPauseButton);
     setTotalTimeInPlayerBar(currentSongFromAlbum.duration);
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

     setSong(songIndex + 1);
     currentSoundFile.play();
     updateSeekBarWhileSongPlays();
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

     setSong(songIndex + 1);
     currentSoundFile.play();
     updateSeekBarWhileSongPlays();
     updatePlayerBarSong();

     var previouslyPlayingSongElement = getSongNumberCell(lastSongNumber);
     previouslyPlayingSongElement.html(lastSongNumber);
     var currentlyPlayingSongElement = getSongNumberCell(currentlyPlayingSongNumber);
     currentlyPlayingSongElement.html(pauseButtonTemplate);
 };

 var setSong = function(songNumber) {
     if (currentSoundFile) {
         currentSoundFile.stop();
     }
     currentlyPlayingSongNumber = parseInt(songNumber);
     currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
     // #1
     currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {
         // #2
         formats: [ 'mp3' ],
         preload: true
     });

     setVolume(currentVolume);
 };

 var seek = function(time) {
     if (currentSoundFile) {
         currentSoundFile.setTime(time);
     }
 }

 var setVolume = function(volume) {
     if (currentSoundFile) {
         currentSoundFile.setVolume(volume);
     }
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
 var currentSoundFile = null;
 var currentVolume = 80;

 var $previousButton = $('.main-controls .previous');
 var $nextButton = $('.main-controls .next');

 $(document).ready(function() {
     setCurrentAlbum(albumPicasso);
     setupSeekBars();
     $previousButton.click(previousSong);
     $nextButton.click(nextSong);
 });
