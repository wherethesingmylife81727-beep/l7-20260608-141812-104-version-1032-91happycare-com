(function () {
  var scriptUrl = document.currentScript ? document.currentScript.src : "";
  var localHlsUrl = scriptUrl ? new URL("hls-vendor-bbsaiqh1.js", scriptUrl).href : "";
  var hlsPromise = null;

  function getHlsClass() {
    if (window.Hls) {
      return Promise.resolve(window.Hls);
    }
    if (!localHlsUrl) {
      return Promise.resolve(null);
    }
    if (!hlsPromise) {
      hlsPromise = import(localHlsUrl).then(function (mod) {
        return mod.H || null;
      }).catch(function () {
        return null;
      });
    }
    return hlsPromise;
  }

  function initOnePlayer(root) {
    var video = root.querySelector("video");
    var cover = root.querySelector(".player-cover");
    var streamUrl = root.getAttribute("data-stream");
    var loaded = false;
    var hlsInstance = null;

    function attach() {
      if (loaded) {
        return Promise.resolve();
      }
      loaded = true;
      return getHlsClass().then(function (HlsClass) {
        if (HlsClass && HlsClass.isSupported()) {
          hlsInstance = new HlsClass({
            enableWorker: true,
            lowLatencyMode: true,
            backBufferLength: 90
          });
          hlsInstance.loadSource(streamUrl);
          hlsInstance.attachMedia(video);
        } else {
          video.src = streamUrl;
        }
      });
    }

    function play() {
      attach().then(function () {
        if (cover) {
          cover.classList.add("is-hidden");
        }
        var action = video.play();
        if (action && typeof action.catch === "function") {
          action.catch(function () {
            if (cover) {
              cover.classList.remove("is-hidden");
            }
          });
        }
      });
    }

    if (!video || !streamUrl) {
      return;
    }

    if (cover) {
      cover.addEventListener("click", play);
    }
    video.addEventListener("click", function () {
      if (!loaded || video.paused) {
        play();
      }
    });
    video.addEventListener("play", function () {
      if (cover) {
        cover.classList.add("is-hidden");
      }
    });
    video.addEventListener("ended", function () {
      if (cover) {
        cover.classList.remove("is-hidden");
      }
    });
    window.addEventListener("beforeunload", function () {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    Array.prototype.slice.call(document.querySelectorAll("[data-player]")).forEach(initOnePlayer);
  });
})();
