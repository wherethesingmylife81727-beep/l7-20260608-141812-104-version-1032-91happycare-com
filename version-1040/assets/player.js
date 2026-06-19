var SitePlayer = (function () {
  function init(selector, source) {
    var container = document.querySelector(selector);
    if (!container) {
      return;
    }
    var video = container.querySelector('video');
    var overlay = container.querySelector('.player-overlay');
    var ready = false;
    var hls = null;
    function load() {
      if (ready || !video || !source) {
        return;
      }
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source;
      } else if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(source);
        hls.attachMedia(video);
      } else {
        video.src = source;
      }
      ready = true;
    }
    function play() {
      load();
      container.classList.add('is-playing');
      if (overlay) {
        overlay.setAttribute('aria-hidden', 'true');
      }
      var promise = video.play();
      if (promise && promise.catch) {
        promise.catch(function () {});
      }
    }
    if (overlay) {
      overlay.addEventListener('click', play);
    }
    video.addEventListener('click', function () {
      if (!ready) {
        play();
      }
    });
    video.addEventListener('play', function () {
      container.classList.add('is-playing');
    });
    video.addEventListener('ended', function () {
      container.classList.remove('is-playing');
    });
    window.addEventListener('beforeunload', function () {
      if (hls && hls.destroy) {
        hls.destroy();
      }
    });
  }
  return {
    init: init
  };
})();
