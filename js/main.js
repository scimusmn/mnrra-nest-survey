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

        // Wait one second. Start video.
        setTimeout(function() {
          showFullscreenVideo(src);

          // Stop background video
          backgroundPlayer.currentTime(0.0);
          backgroundPlayer.pause();

        }, 300);

      },});

      TweenMax.to($(this), 0.8, { css: { opacity:1, scale:1.02 }, delay:0.02, ease:Elastic.easeOut});

    });

    // Shrink on mousedown
    $('.video-button').on('mousedown', function() {

      TweenMax.to($(this), 0.05, { css: { scale:0.99 }, ease:Power3.easeOut});

    });

    // Reset scale on mouseout
    $('.video-button').on('mouseout', function() {

      TweenMax.to($(this), 0.0, { css: { scale:1.0 }});

    });

  }

  function lockButtons(doLock) {

    buttonsLocked = doLock;

  }

  function setupBackgroundVideo() {

    // Create video tag
    var options = { 'controls': false, 'autoplay': false, 'loop': true, 'preload': 'auto' };

    // Initialize player
    backgroundPlayer = videojs('background_video', options, function() {

      this.src([{ type: 'video/mp4', src: './videos/background.mp4' }]);
      this.play();

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

        // console.log('Video waiting.');

      });

      this.on('ended', function() {

        hideFullscreenVideo();
        transitionInSelectionScreen();

      });

    });

    // Home button
    $('.home-btn').on('click', function() {

      hideFullscreenVideo();

    });

  }

  function transitionInSelectionScreen() {

    backgroundPlayer.currentTime(0.0);

    // Slide btns from bottom
    TweenMax.staggerFrom('.video-button', 1, {bottom:-800, delay:0.25, ease:Power3.easeOut}, 0.2);

    // Fade unchosen butttons back in
    TweenMax.to($('.video-button'), 0.4, { css: { opacity:1, scale:1 }, delay:1.5, ease:Power3.easeIn });

  }

  function showFullscreenVideo(vidSrc) {

    videoPlayer.pause();
    videoPlayer.src([{ type: 'video/mp4', src: vidSrc }]);

  }

  function hideFullscreenVideo() {

    // Start the background video
    backgroundPlayer.currentTime(0.0);
    backgroundPlayer.play();

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

    // 3 minute screensaver timeout (one minute more than longest video)
    screensaver = new Screensaver(3 * 60, 'videos/screensaver.mp4',
        function() {

          // Go to screensaver
          // Stop background video
          backgroundPlayer.currentTime(0.0);
          backgroundPlayer.pause();

        },

        function() {

          // Awake from SS
          // Start the background video
          backgroundPlayer.currentTime(0.0);
          backgroundPlayer.play();

        });

  }

  initialize();

});

