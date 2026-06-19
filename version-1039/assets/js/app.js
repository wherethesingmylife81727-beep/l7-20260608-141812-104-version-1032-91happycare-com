(function () {
  function $(selector, root) {
    return (root || document).querySelector(selector);
  }

  function $all(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function escapeText(value) {
    return String(value || "").replace(/[&<>"]/g, function (char) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "\"": "&quot;"
      }[char];
    });
  }

  function initMenu() {
    var toggle = $("[data-menu-toggle]");
    var mobile = $("[data-mobile-nav]");
    if (!toggle || !mobile) {
      return;
    }
    toggle.addEventListener("click", function () {
      mobile.classList.toggle("is-open");
    });
  }

  function initHero() {
    var root = $("[data-hero]");
    if (!root) {
      return;
    }
    var slides = $all("[data-hero-slide]", root);
    var dots = $all("[data-hero-dot]", root);
    var prev = $("[data-hero-prev]", root);
    var next = $("[data-hero-next]", root);
    if (!slides.length) {
      return;
    }
    var current = 0;
    var timer = null;

    function show(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle("is-active", i === current);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle("is-active", i === current);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(current + 1);
      }, 5600);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
      }
    }

    if (prev) {
      prev.addEventListener("click", function () {
        show(current - 1);
        start();
      });
    }
    if (next) {
      next.addEventListener("click", function () {
        show(current + 1);
        start();
      });
    }
    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        show(Number(dot.getAttribute("data-hero-dot")) || 0);
        start();
      });
    });
    root.addEventListener("mouseenter", stop);
    root.addEventListener("mouseleave", start);
    show(0);
    start();
  }

  function card(item) {
    var tags = (item.tags || []).slice(0, 4).map(function (tag) {
      return "<span>" + escapeText(tag) + "</span>";
    }).join("");
    return "<article class=\"movie-card\">" +
      "<a class=\"card-poster\" href=\"" + escapeText(item.href) + "\">" +
      "<img src=\"" + escapeText(item.cover) + "\" alt=\"" + escapeText(item.title) + "\" loading=\"lazy\">" +
      "<span class=\"poster-shade\"></span><span class=\"play-chip\">播放</span></a>" +
      "<div class=\"card-body\"><div class=\"meta-line\"><span>" + escapeText(item.year) + "</span><span>" + escapeText(item.type) + "</span><span>" + escapeText(item.region) + "</span></div>" +
      "<h3><a href=\"" + escapeText(item.href) + "\">" + escapeText(item.title) + "</a></h3>" +
      "<p>" + escapeText(item.desc) + "</p><div class=\"tag-row\">" + tags + "</div></div></article>";
  }

  function initSearchPage() {
    var results = $("[data-search-results]");
    if (!results || !window.SEARCH_MOVIES) {
      return;
    }
    var input = $("[data-search-page-input]");
    var title = $("[data-search-title]");
    var desc = $("[data-search-desc]");
    var params = new URLSearchParams(window.location.search);
    var q = (params.get("q") || "").trim();
    if (input) {
      input.value = q;
    }
    if (!q) {
      return;
    }
    var tokens = q.toLowerCase().split(/\s+/).filter(Boolean);
    var matches = window.SEARCH_MOVIES.filter(function (item) {
      var hay = [item.title, item.year, item.region, item.type, item.genre, item.desc].concat(item.tags || []).join(" ").toLowerCase();
      return tokens.every(function (token) {
        return hay.indexOf(token) !== -1;
      });
    }).slice(0, 120);
    if (title) {
      title.textContent = "搜索结果";
    }
    if (desc) {
      desc.textContent = matches.length ? "以下内容与关键词匹配。" : "暂无匹配内容，可尝试更换关键词。";
    }
    results.innerHTML = matches.map(card).join("");
  }

  document.addEventListener("DOMContentLoaded", function () {
    initMenu();
    initHero();
    initSearchPage();
  });
})();
