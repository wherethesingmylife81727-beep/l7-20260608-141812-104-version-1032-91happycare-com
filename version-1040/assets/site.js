(function () {
  var rootPrefix = location.pathname.indexOf('/movies/') >= 0 ? '../' : './';

  function $(selector, parent) {
    return (parent || document).querySelector(selector);
  }

  function $all(selector, parent) {
    return Array.prototype.slice.call((parent || document).querySelectorAll(selector));
  }

  function normalize(value) {
    return String(value || '').toLowerCase().trim();
  }

  function itemUrl(item) {
    return rootPrefix + item.path;
  }

  function imageUrl(item) {
    return rootPrefix + item.image;
  }

  function setupMenu() {
    var button = $('[data-menu-button]');
    var nav = $('[data-nav-links]');
    if (!button || !nav) {
      return;
    }
    button.addEventListener('click', function () {
      nav.classList.toggle('open');
    });
  }

  function setupGlobalSearch() {
    var panel = $('[data-search-panel]');
    var input = $('[data-global-search-input]');
    var results = $('[data-global-search-results]');
    var toggles = $all('[data-search-toggle]');
    if (!panel || !input || !results || !window.SiteSearchData) {
      return;
    }
    toggles.forEach(function (button) {
      button.addEventListener('click', function () {
        panel.classList.toggle('open');
        if (panel.classList.contains('open')) {
          input.focus();
        }
      });
    });
    input.addEventListener('input', function () {
      var query = normalize(input.value);
      if (query.length < 1) {
        results.innerHTML = '';
        return;
      }
      var matches = window.SiteSearchData.filter(function (item) {
        return normalize(item.title + ' ' + item.year + ' ' + item.region + ' ' + item.type + ' ' + item.category + ' ' + item.genre).indexOf(query) >= 0;
      }).slice(0, 12);
      results.innerHTML = matches.map(function (item) {
        return '<a class="search-result" href="' + itemUrl(item) + '">' +
          '<img src="' + imageUrl(item) + '" alt="' + item.title.replace(/"/g, '&quot;') + '">' +
          '<span><strong>' + item.title + '</strong><em>' + item.year + ' · ' + item.region + ' · ' + item.type + '</em></span>' +
          '</a>';
      }).join('');
    });
  }

  function setupHero() {
    var carousel = $('[data-hero-carousel]');
    if (!carousel) {
      return;
    }
    var slides = $all('[data-hero-slide]', carousel);
    var next = $('[data-hero-next]', carousel);
    var prev = $('[data-hero-prev]', carousel);
    if (slides.length < 2) {
      return;
    }
    var index = 0;
    function show(nextIndex) {
      slides[index].classList.remove('active');
      index = (nextIndex + slides.length) % slides.length;
      slides[index].classList.add('active');
    }
    if (next) {
      next.addEventListener('click', function () {
        show(index + 1);
      });
    }
    if (prev) {
      prev.addEventListener('click', function () {
        show(index - 1);
      });
    }
    setInterval(function () {
      show(index + 1);
    }, 5200);
  }

  function setupPageFilter() {
    var search = $('[data-page-search]');
    var grids = $all('[data-filter-grid]');
    var pills = $all('[data-filter-value], [data-filter-type]');
    var empty = $('[data-empty-state]');
    if (!search && !pills.length) {
      return;
    }
    var selectedYear = 'all';
    var selectedType = 'all';
    function apply() {
      var query = normalize(search ? search.value : '');
      var visible = 0;
      grids.forEach(function (grid) {
        $all('[data-title]', grid).forEach(function (card) {
          var text = normalize(card.getAttribute('data-title') + ' ' + card.getAttribute('data-year') + ' ' + card.getAttribute('data-type') + ' ' + card.getAttribute('data-region') + ' ' + card.getAttribute('data-genre'));
          var yearOk = selectedYear === 'all' || card.getAttribute('data-year') === selectedYear;
          var typeOk = selectedType === 'all' || card.getAttribute('data-type') === selectedType;
          var queryOk = query === '' || text.indexOf(query) >= 0;
          var show = yearOk && typeOk && queryOk;
          card.classList.toggle('hidden', !show);
          if (show) {
            visible += 1;
          }
        });
      });
      if (empty) {
        empty.classList.toggle('show', visible === 0);
      }
    }
    if (search) {
      search.addEventListener('input', apply);
    }
    pills.forEach(function (pill) {
      pill.addEventListener('click', function () {
        var isType = pill.hasAttribute('data-filter-type');
        if (isType) {
          selectedType = pill.getAttribute('data-filter-type') || 'all';
        } else {
          selectedYear = pill.getAttribute('data-filter-value') || 'all';
          selectedType = 'all';
        }
        pills.forEach(function (item) {
          item.classList.remove('active');
        });
        pill.classList.add('active');
        apply();
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    setupMenu();
    setupGlobalSearch();
    setupHero();
    setupPageFilter();
  });
})();
