$(document).ready(function() {

  var videoPlayer = {};
  var backgroundPlayer = {};
  var screensaver = {};
  var buttonsLocked = false;

  function initialize() {

    setupFullscreenVideo();
    setupBackgroundVideo();
    setupThumbGrid();
    setupScreenSaver();

  }

  function setupThumbGrid() {

    // Attach click listeners
    $('.video-button').on('click', function() {

      if (buttonsLocked) return;

      lockButtons(true);

      // Launch fullscreen video player
      var src = $(this).attr('data-video');

      // Quick depth animation highlighting selected video
      TweenMax.to($(this).siblings('.video-button'), 0.35, { css: { opacity:0.6, scale:1 }, delay:0.01, ease:Power2.easeOut, onComplete:function() {
        showFullscreenVideo(src);
      },});

      TweenMax.to($(this), 0.8, { css: { opacity:1, scale:1.01 }, delay:0.075, ease:Elastic.easeOut});

    });

  }

  function lockButtons(doLock) {

    buttonsLocked = doLock;

  }

  function setupBackgroundVideo() {

    // Create video tag
    var options = { 'controls': false, 'autoplay': true, 'loop': true, 'preload': 'auto' };

    // Initialize player
    backgroundPlayer = videojs('background_video', options, function() {

      this.src([{ type: 'video/mp4', src: './videos/background.mp4' }]);

      // Player (this) is initialized and ready.
      this.on('playing', function() {

        console.log('background video started');

      });

    });

  }

  function setupFullscreenVideo() {

    // Create video tag
    var options = { 'controls': false, 'autoplay': true, 'loop': false, 'preload': 'auto' };

    // Initialize player
    videoPlayer = videojs('fullscreen_video', options, function() {

      // Player (this) is initialized and ready.
      this.on('playing', function() {

        $('#player_screen').show();

      });

      this.on('waiting', function() {

        console.log('Video waiting.');

      });

      this.on('ended', function() {

        hideFullscreenVideo();
        transitionInSelectionScreen();

      });

    });

    //Home button
    $('.home-btn').on('click', function() {

      hideFullscreenVideo();

    });

  }

  function transitionInSelectionScreen() {

    backgroundPlayer.currentTime = 0;

    // TODO - Tweens for transitioning back from video.

  }

  function showFullscreenVideo(vidSrc) {

    videoPlayer.src([{ type: 'video/mp4', src: vidSrc }]);

  }

  function hideFullscreenVideo() {

    //Hide the video
    $('#player_screen').fadeOut('fast', function() {
      videoPlayer.pause();
      $('#player_screen').hide();
    });

    //Hide the video
    $('#player_screen').fadeOut('fast', function() {
      videoPlayer.pause();
      $('#player_screen').hide();
      TweenMax.to($('.video-button'), 0.4, { css: { opacity:1, scale:1 }, delay:0.05, ease:Power3.easeIn });
      lockButtons(false);
    });

  }

  function setupScreenSaver() {

    //3 minute screensaver timeout (one minute more than longest video)
    screensaver = new Screensaver(1 * 60, 'videos/screensaver.mp4',
        function() {

            // Go to screensaver

        },
        function() {

            // Awake from SS

        });

  }

  initialize();

});

