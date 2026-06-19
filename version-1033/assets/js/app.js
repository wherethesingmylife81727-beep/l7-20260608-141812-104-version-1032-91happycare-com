(function () {
  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
    } else {
      document.addEventListener("DOMContentLoaded", fn);
    }
  }

  function setupMenu() {
    var toggle = document.querySelector("[data-menu-toggle]");
    var panel = document.querySelector("[data-mobile-panel]");
    if (!toggle || !panel) {
      return;
    }
    toggle.addEventListener("click", function () {
      panel.classList.toggle("is-open");
    });
  }

  function setupHero() {
    var hero = document.querySelector("[data-hero]");
    if (!hero) {
      return;
    }
    var slides = Array.prototype.slice.call(hero.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
    if (slides.length < 2) {
      return;
    }
    var index = 0;
    var timer = null;

    function show(next) {
      index = (next + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle("is-active", i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle("is-active", i === index);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
      }
    }

    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        show(Number(dot.getAttribute("data-hero-dot") || 0));
        start();
      });
    });

    hero.addEventListener("mouseenter", stop);
    hero.addEventListener("mouseleave", start);
    start();
  }

  function setupFilters() {
    var list = document.querySelector("[data-filter-list]");
    if (!list) {
      return;
    }
    var cards = Array.prototype.slice.call(list.querySelectorAll(".searchable"));
    var search = document.querySelector("[data-filter-search]");
    var type = document.querySelector("[data-filter-type]");
    var year = document.querySelector("[data-filter-year]");
    var empty = document.querySelector("[data-filter-empty]");

    function apply() {
      var query = search ? search.value.trim().toLowerCase() : "";
      var selectedType = type ? type.value : "";
      var selectedYear = year ? year.value : "";
      var visible = 0;
      cards.forEach(function (card) {
        var text = card.getAttribute("data-search") || "";
        var cardType = card.getAttribute("data-type") || "";
        var cardYear = card.getAttribute("data-year") || "";
        var ok = true;
        if (query && text.indexOf(query) === -1) {
          ok = false;
        }
        if (selectedType && cardType !== selectedType) {
          ok = false;
        }
        if (selectedYear && cardYear !== selectedYear) {
          ok = false;
        }
        card.style.display = ok ? "" : "none";
        if (ok) {
          visible += 1;
        }
      });
      if (empty) {
        empty.classList.toggle("is-visible", visible === 0);
      }
    }

    [search, type, year].forEach(function (el) {
      if (el) {
        el.addEventListener("input", apply);
        el.addEventListener("change", apply);
      }
    });
    apply();
  }

  function cardTemplate(item) {
    var tags = item.tags.slice(0, 3).map(function (tag) {
      return "<span>" + escapeHtml(tag) + "</span>";
    }).join("");
    return "<article class=\"movie-card searchable\">" +
      "<a class=\"poster-link\" href=\"" + item.url + "\" aria-label=\"" + escapeHtml(item.title) + "\">" +
      "<div class=\"poster-frame\">" +
      "<img src=\"" + item.cover + "\" alt=\"" + escapeHtml(item.title) + "\" loading=\"lazy\">" +
      "<span class=\"quality-mark\">高清</span><span class=\"play-hover\">▶</span>" +
      "</div></a><div class=\"card-body\">" +
      "<h3><a href=\"" + item.url + "\">" + escapeHtml(item.title) + "</a></h3>" +
      "<p class=\"card-line\">" + escapeHtml(item.line) + "</p>" +
      "<div class=\"card-meta\"><span>" + escapeHtml(item.year) + "</span><span>" + escapeHtml(item.region) + "</span><span>" + escapeHtml(item.type) + "</span></div>" +
      "<div class=\"tag-row\">" + tags + "</div></div></article>";
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function setupSearchPage() {
    var results = document.querySelector("[data-search-results]");
    var input = document.querySelector("[data-search-input]");
    var form = document.querySelector("[data-search-form]");
    var empty = document.querySelector("[data-search-empty]");
    if (!results || !input || typeof MOVIE_INDEX === "undefined") {
      return;
    }
    var params = new URLSearchParams(window.location.search);
    var initial = params.get("q") || "";
    input.value = initial;

    function render() {
      var query = input.value.trim().toLowerCase();
      if (!query) {
        if (empty) {
          empty.classList.remove("is-visible");
        }
        return;
      }
      var matched = MOVIE_INDEX.filter(function (item) {
        return item.search.indexOf(query) !== -1;
      }).slice(0, 96);
      results.innerHTML = matched.map(cardTemplate).join("");
      if (empty) {
        empty.classList.toggle("is-visible", matched.length === 0);
      }
    }

    input.addEventListener("input", render);
    if (form) {
      form.addEventListener("submit", function (event) {
        event.preventDefault();
        var nextUrl = new URL(window.location.href);
        nextUrl.searchParams.set("q", input.value.trim());
        window.history.replaceState(null, "", nextUrl.toString());
        render();
      });
    }
    render();
  }

  ready(function () {
    setupMenu();
    setupHero();
    setupFilters();
    setupSearchPage();
  });
})();
