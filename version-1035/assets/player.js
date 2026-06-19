(function () {
    function init(videoId, overlayId, streamUrl) {
        var video = document.getElementById(videoId);
        var overlay = document.getElementById(overlayId);
        var started = false;
        var hls = null;

        if (!video || !overlay || !streamUrl) {
            return;
        }

        function attach() {
            if (started) {
                return;
            }
            started = true;
            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = streamUrl;
            } else if (window.Hls && window.Hls.isSupported()) {
                hls = new window.Hls({
                    autoStartLoad: true,
                    capLevelToPlayerSize: true
                });
                hls.loadSource(streamUrl);
                hls.attachMedia(video);
            } else {
                video.src = streamUrl;
            }
            video.controls = true;
        }

        function start() {
            attach();
            overlay.classList.add('is-hidden');
            var playPromise = video.play();
            if (playPromise && typeof playPromise.catch === 'function') {
                playPromise.catch(function () {
                    overlay.classList.remove('is-hidden');
                });
            }
        }

        overlay.addEventListener('click', start);
        video.addEventListener('click', function () {
            if (!started || video.paused) {
                start();
            }
        });
        video.addEventListener('play', function () {
            overlay.classList.add('is-hidden');
        });
        video.addEventListener('pause', function () {
            if (!video.ended) {
                overlay.classList.remove('is-hidden');
            }
        });
    }

    window.MoviePlayer = {
        init: init
    };
})();
