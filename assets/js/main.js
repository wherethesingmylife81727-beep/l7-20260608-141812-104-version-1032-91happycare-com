(function () {
    function ready(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback);
        } else {
            callback();
        }
    }

    function valueOf(element, name) {
        return (element.getAttribute(name) || "").toLowerCase();
    }

    function initMenu() {
        var button = document.querySelector("[data-menu-toggle]");
        var nav = document.querySelector("[data-mobile-nav]");
        if (!button || !nav) {
            return;
        }
        button.addEventListener("click", function () {
            nav.classList.toggle("is-open");
        });
    }

    function initHero() {
        var hero = document.querySelector("[data-hero]");
        if (!hero) {
            return;
        }
        var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
        var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
        var prev = hero.querySelector("[data-hero-prev]");
        var next = hero.querySelector("[data-hero-next]");
        var index = 0;

        function show(nextIndex) {
            if (!slides.length) {
                return;
            }
            index = (nextIndex + slides.length) % slides.length;
            slides.forEach(function (slide, i) {
                slide.classList.toggle("is-active", i === index);
            });
            dots.forEach(function (dot, i) {
                dot.classList.toggle("is-active", i === index);
            });
        }

        if (prev) {
            prev.addEventListener("click", function () {
                show(index - 1);
            });
        }
        if (next) {
            next.addEventListener("click", function () {
                show(index + 1);
            });
        }
        dots.forEach(function (dot) {
            dot.addEventListener("click", function () {
                show(parseInt(dot.getAttribute("data-hero-dot"), 10) || 0);
            });
        });
        window.setInterval(function () {
            show(index + 1);
        }, 5000);
    }

    function initFilters() {
        document.querySelectorAll("[data-filter-panel]").forEach(function (panel) {
            var scope = panel.parentElement || document;
            var cards = Array.prototype.slice.call(scope.querySelectorAll("[data-card]"));
            var keyword = panel.querySelector("[data-filter-keyword]");
            var region = panel.querySelector("[data-filter-region]");
            var type = panel.querySelector("[data-filter-type]");
            var year = panel.querySelector("[data-filter-year]");
            var empty = panel.querySelector("[data-empty]");

            function apply() {
                var key = keyword ? keyword.value.trim().toLowerCase() : "";
                var regionValue = region ? region.value.toLowerCase() : "";
                var typeValue = type ? type.value.toLowerCase() : "";
                var yearValue = year ? year.value.toLowerCase() : "";
                var visible = 0;

                cards.forEach(function (card) {
                    var text = [
                        valueOf(card, "data-title"),
                        valueOf(card, "data-year"),
                        valueOf(card, "data-region"),
                        valueOf(card, "data-type"),
                        valueOf(card, "data-tags")
                    ].join(" ");
                    var matched = true;
                    if (key && text.indexOf(key) === -1) {
                        matched = false;
                    }
                    if (regionValue && valueOf(card, "data-region") !== regionValue) {
                        matched = false;
                    }
                    if (typeValue && valueOf(card, "data-type") !== typeValue) {
                        matched = false;
                    }
                    if (yearValue && valueOf(card, "data-year") !== yearValue) {
                        matched = false;
                    }
                    card.hidden = !matched;
                    if (matched) {
                        visible += 1;
                    }
                });

                if (empty) {
                    empty.hidden = visible !== 0;
                }
            }

            [keyword, region, type, year].forEach(function (control) {
                if (!control) {
                    return;
                }
                control.addEventListener("input", apply);
                control.addEventListener("change", apply);
            });
        });
    }

    function initPlayers() {
        document.querySelectorAll("[data-player]").forEach(function (player) {
            var video = player.querySelector("video[data-stream]");
            var button = player.querySelector("[data-play]");
            if (!video || !button) {
                return;
            }

            function bind() {
                if (player.getAttribute("data-ready") === "1") {
                    return;
                }
                var src = video.getAttribute("data-stream");
                if (!src) {
                    return;
                }
                if (video.canPlayType("application/vnd.apple.mpegurl")) {
                    video.src = src;
                } else if (window.Hls && window.Hls.isSupported()) {
                    var hls = new window.Hls({ enableWorker: true });
                    hls.loadSource(src);
                    hls.attachMedia(video);
                    player._hls = hls;
                } else {
                    video.src = src;
                }
                player.setAttribute("data-ready", "1");
            }

            function play() {
                bind();
                player.classList.add("is-playing");
                var result = video.play();
                if (result && typeof result.catch === "function") {
                    result.catch(function () {});
                }
            }

            button.addEventListener("click", play);
            video.addEventListener("click", function () {
                if (video.paused) {
                    play();
                }
            });
        });
    }

    ready(function () {
        initMenu();
        initHero();
        initFilters();
        initPlayers();
    });
})();
