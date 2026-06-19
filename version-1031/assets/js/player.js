(function () {
    function initMoviePlayer(options) {
        var video = document.getElementById(options.videoId);
        var overlay = document.getElementById(options.overlayId);
        var button = document.getElementById(options.buttonId);
        var source = options.source;
        var attached = false;
        var hls = null;

        if (!video || !source) {
            return;
        }

        function attachSource() {
            if (attached) {
                return;
            }

            attached = true;

            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = source;
                return;
            }

            if (window.Hls && window.Hls.isSupported()) {
                hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true,
                    backBufferLength: 90
                });
                hls.loadSource(source);
                hls.attachMedia(video);
                return;
            }

            video.src = source;
        }

        function hideOverlay() {
            if (overlay) {
                overlay.classList.add('is-hidden');
            }
        }

        function showOverlay() {
            if (overlay) {
                overlay.classList.remove('is-hidden');
            }
        }

        function startPlayback(event) {
            if (event) {
                event.preventDefault();
            }
            attachSource();
            hideOverlay();
            var promise = video.play();
            if (promise && typeof promise.catch === 'function') {
                promise.catch(function () {
                    showOverlay();
                });
            }
        }

        attachSource();

        if (overlay) {
            overlay.addEventListener('click', startPlayback);
        }

        if (button && button !== overlay) {
            button.addEventListener('click', startPlayback);
        }

        video.addEventListener('play', hideOverlay);
        video.addEventListener('click', function () {
            if (video.paused) {
                startPlayback();
            }
        });

        window.addEventListener('beforeunload', function () {
            if (hls && typeof hls.destroy === 'function') {
                hls.destroy();
            }
        });
    }

    window.initMoviePlayer = initMoviePlayer;
}());
