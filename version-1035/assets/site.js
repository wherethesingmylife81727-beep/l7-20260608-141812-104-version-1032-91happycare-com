(function () {
    function qs(selector, root) {
        return (root || document).querySelector(selector);
    }

    function qsa(selector, root) {
        return Array.prototype.slice.call((root || document).querySelectorAll(selector));
    }

    function setupMobileMenu() {
        var toggle = qs('[data-mobile-toggle]');
        var menu = qs('[data-mobile-nav]');
        if (!toggle || !menu) {
            return;
        }
        toggle.addEventListener('click', function () {
            menu.classList.toggle('is-open');
        });
    }

    function getText(value) {
        return String(value || '').toLowerCase();
    }

    function setupCardFilter() {
        var panels = qsa('[data-filter-panel]');
        panels.forEach(function (panel) {
            var input = qs('[data-filter-input]', panel);
            var year = qs('[data-year-filter]', panel);
            var type = qs('[data-type-filter]', panel);
            var region = qs('[data-region-filter]', panel);
            var cards = qsa('[data-movie-card]');

            function apply() {
                var keyword = getText(input ? input.value : '');
                var yearValue = year ? year.value : '';
                var typeValue = type ? type.value : '';
                var regionValue = region ? region.value : '';

                cards.forEach(function (card) {
                    var haystack = getText([
                        card.getAttribute('data-title'),
                        card.getAttribute('data-tags'),
                        card.getAttribute('data-region'),
                        card.getAttribute('data-type'),
                        card.getAttribute('data-year'),
                        card.getAttribute('data-category')
                    ].join(' '));
                    var matchKeyword = !keyword || haystack.indexOf(keyword) !== -1;
                    var matchYear = !yearValue || card.getAttribute('data-year') === yearValue;
                    var matchType = !typeValue || card.getAttribute('data-type') === typeValue;
                    var matchRegion = !regionValue || card.getAttribute('data-region') === regionValue;
                    card.classList.toggle('is-hidden', !(matchKeyword && matchYear && matchType && matchRegion));
                });
            }

            [input, year, type, region].forEach(function (element) {
                if (element) {
                    element.addEventListener('input', apply);
                    element.addEventListener('change', apply);
                }
            });

            var params = new URLSearchParams(window.location.search);
            var query = params.get('q');
            if (query && input) {
                input.value = query;
            }
            apply();
        });
    }

    function setupHeroSearch() {
        qsa('[data-site-search]').forEach(function (form) {
            form.addEventListener('submit', function (event) {
                event.preventDefault();
                var input = qs('input', form);
                var value = input ? input.value.trim() : '';
                var target = form.getAttribute('data-search-target') || './search.html';
                if (value) {
                    window.location.href = target + '?q=' + encodeURIComponent(value);
                } else {
                    window.location.href = target;
                }
            });
        });
    }

    function setupHeroSlider() {
        var slider = qs('[data-hero-slider]');
        if (!slider) {
            return;
        }
        var slides = qsa('[data-hero-slide]', slider);
        var dots = qsa('[data-hero-dot]', slider);
        var prev = qs('[data-hero-prev]', slider);
        var next = qs('[data-hero-next]', slider);
        var current = 0;
        var timer = null;

        function show(index) {
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, i) {
                slide.classList.toggle('is-active', i === current);
            });
            dots.forEach(function (dot, i) {
                dot.classList.toggle('is-active', i === current);
            });
        }

        function move(step) {
            show(current + step);
        }

        function restart() {
            if (timer) {
                clearInterval(timer);
            }
            timer = setInterval(function () {
                move(1);
            }, 5200);
        }

        if (prev) {
            prev.addEventListener('click', function () {
                move(-1);
                restart();
            });
        }
        if (next) {
            next.addEventListener('click', function () {
                move(1);
                restart();
            });
        }
        dots.forEach(function (dot, index) {
            dot.addEventListener('click', function () {
                show(index);
                restart();
            });
        });
        show(0);
        restart();
    }

    document.addEventListener('DOMContentLoaded', function () {
        setupMobileMenu();
        setupCardFilter();
        setupHeroSearch();
        setupHeroSlider();
    });
})();
