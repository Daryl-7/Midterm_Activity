(function () {
  "use strict";

  var root = document.documentElement;
  var reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  /* ===== Theme toggle ===== */
  var themeToggle = document.getElementById("themeToggle");

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    themeToggle.setAttribute(
      "aria-label",
      theme === "dark" ? "Switch to light theme" : "Switch to dark theme",
    );
  }

  applyTheme(root.getAttribute("data-theme") || "light");

  themeToggle.addEventListener("click", function () {
    var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    applyTheme(next);
    try {
      localStorage.setItem("theme", next);
    } catch (e) {}
  });

  /* ===== Mobile menu ===== */
  var burger = document.getElementById("burger");
  var navLinks = document.getElementById("navLinks");

  function setMenu(open) {
    navLinks.classList.toggle("is-open", open);
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }

  burger.addEventListener("click", function () {
    setMenu(!navLinks.classList.contains("is-open"));
  });

  navLinks.addEventListener("click", function (e) {
    if (e.target.closest("a")) setMenu(false);
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") setMenu(false);
  });

  /* ===== Scroll progress, navbar state, back to top ===== */
  var progress = document.getElementById("progress");
  var nav = document.getElementById("nav");
  var toTop = document.getElementById("toTop");
  var ticking = false;

  function onScroll() {
    var scrollTop = window.scrollY || document.documentElement.scrollTop;
    var height = document.documentElement.scrollHeight - window.innerHeight;
    var ratio = height > 0 ? Math.min(scrollTop / height, 1) : 0;

    progress.style.transform = "scaleX(" + ratio + ")";
    nav.classList.toggle("is-scrolled", scrollTop > 12);
    toTop.classList.toggle("is-visible", scrollTop > 600);
    ticking = false;
  }

  window.addEventListener(
    "scroll",
    function () {
      if (!ticking) {
        window.requestAnimationFrame(onScroll);
        ticking = true;
      }
    },
    { passive: true },
  );
  onScroll();

  toTop.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  });

  /* ===== Active nav link ===== */
  var sectionLinks = {};
  document
    .querySelectorAll(".nav__links a[data-section]")
    .forEach(function (link) {
      sectionLinks[link.getAttribute("data-section")] = link;
    });

  if ("IntersectionObserver" in window) {
    var sectionObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          Object.keys(sectionLinks).forEach(function (id) {
            sectionLinks[id].classList.toggle(
              "is-active",
              id === entry.target.id,
            );
          });
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );

    Object.keys(sectionLinks).forEach(function (id) {
      var section = document.getElementById(id);
      if (section) sectionObserver.observe(section);
    });

    var hero = document.getElementById("home");
    if (hero) {
      new IntersectionObserver(
        function (entries) {
          if (entries[0].isIntersecting) {
            Object.keys(sectionLinks).forEach(function (id) {
              sectionLinks[id].classList.remove("is-active");
            });
          }
        },
        { rootMargin: "-45% 0px -50% 0px" },
      ).observe(hero);
    }
  }

  /* ===== Scroll reveal (with a small stagger inside each group) ===== */
  var revealItems = document.querySelectorAll(".reveal");

  document
    .querySelectorAll(".cards, .skill-groups, .levelup__list")
    .forEach(function (group) {
      group.querySelectorAll(":scope > .reveal").forEach(function (item, i) {
        item.style.setProperty("--d", i * 0.1 + "s");
      });
    });

  function showItem(item) {
    item.classList.add("is-visible");
    if (item.classList.contains("card")) {
      setTimeout(function () {
        item.classList.add("is-settled");
      }, 1000);
    }
  }

  if ("IntersectionObserver" in window && !reduceMotion) {
    var revealObserver = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            showItem(entry.target);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 },
    );
    revealItems.forEach(function (item) {
      revealObserver.observe(item);
    });
  } else {
    revealItems.forEach(function (item) {
      item.classList.add("is-visible", "is-settled");
    });
  }

  /* ===== Typing effect in the hero ===== */
  var typedEl = document.getElementById("typed");
  var phrases = [
    "Aspiring Cybersecurity Specialist",
    "Former Technical Support Rep",
    "Always Learning",
  ];

  if (typedEl && !reduceMotion) {
    var phraseIndex = 0;
    var charIndex = phrases[0].length;
    var deleting = false;

    var tick = function () {
      var phrase = phrases[phraseIndex];

      if (!deleting) {
        charIndex++;
        typedEl.textContent = phrase.slice(0, charIndex);
        if (charIndex === phrase.length) {
          deleting = true;
          return setTimeout(tick, 2200);
        }
        return setTimeout(tick, 70);
      }

      charIndex--;
      typedEl.textContent = phrase.slice(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        return setTimeout(tick, 350);
      }
      return setTimeout(tick, 35);
    };

    setTimeout(function () {
      deleting = true;
      tick();
    }, 2800);
  }

  /* ===== Skill filter tabs ===== */
  var filterButtons = document.querySelectorAll(".filter");
  var tags = document.querySelectorAll(".tag");
  var groups = document.querySelectorAll(".skill-group");

  function applyFilter(type) {
    tags.forEach(function (tag) {
      var match = type === "all" || tag.getAttribute("data-type") === type;
      tag.classList.toggle("is-hidden", !match);
      tag.classList.remove("is-entering");
      if (match) {
        void tag.offsetWidth;
        tag.classList.add("is-entering");
      }
    });

    groups.forEach(function (group) {
      var anyVisible = group.querySelector(".tag:not(.is-hidden)");
      group.classList.toggle("is-empty", !anyVisible);
    });
  }

  filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      filterButtons.forEach(function (b) {
        var active = b === button;
        b.classList.toggle("is-active", active);
        b.setAttribute("aria-selected", String(active));
      });
      applyFilter(button.getAttribute("data-filter"));
    });
  });

  /* ===== Copy buttons ===== */
  var toast = document.getElementById("toast");
  var toastTimer;

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.classList.remove("is-visible");
    }, 1800);
  }

  document.querySelectorAll("[data-copy]").forEach(function (button) {
    button.addEventListener("click", function () {
      var value = button.getAttribute("data-copy");

      function done() {
        showToast("Copied: " + value);
      }
      function fail() {
        showToast("Could not copy. Please copy it manually.");
      }

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(value).then(done, fail);
      } else {
        try {
          var temp = document.createElement("textarea");
          temp.value = value;
          temp.setAttribute("readonly", "");
          temp.style.position = "fixed";
          temp.style.opacity = "0";
          document.body.appendChild(temp);
          temp.select();
          document.execCommand("copy");
          document.body.removeChild(temp);
          done();
        } catch (e) {
          fail();
        }
      }
    });
  });

  /* ===== Card tilt that follows the mouse ===== */
  var finePointer = window.matchMedia(
    "(hover: hover) and (pointer: fine)",
  ).matches;

  if (finePointer && !reduceMotion) {
    document.querySelectorAll(".tilt").forEach(function (card) {
      card.addEventListener("mousemove", function (e) {
        var rect = card.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width - 0.5;
        var y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform =
          "perspective(800px) rotateX(" +
          (-y * 6).toFixed(2) +
          "deg) rotateY(" +
          (x * 6).toFixed(2) +
          "deg) translateY(-4px)";
      });
      card.addEventListener("mouseleave", function () {
        card.style.transform = "";
      });
    });
  }

  /* ===== Custom cursor (mouse devices only) ===== */
  if (finePointer && !reduceMotion) {
    var dot = document.createElement("div");
    var ring = document.createElement("div");
    dot.className = "cursor-dot";
    ring.className = "cursor-ring";
    document.body.appendChild(dot);
    document.body.appendChild(ring);
    root.classList.add("has-custom-cursor");

    var mouseX = 0,
      mouseY = 0,
      ringX = 0,
      ringY = 0;
    var started = false;

    document.addEventListener("mousemove", function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = "translate(" + mouseX + "px," + mouseY + "px)";
      if (!started) {
        ringX = mouseX;
        ringY = mouseY;
        started = true;
      }
      root.classList.remove("cursor-hidden");
    });

    document.addEventListener("mouseleave", function () {
      root.classList.add("cursor-hidden");
    });

    var follow = function () {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      ring.style.transform =
        "translate(" + ringX.toFixed(1) + "px," + ringY.toFixed(1) + "px)";
      window.requestAnimationFrame(follow);
    };
    follow();

    var hoverSelector = "a, button, .tag, .card";
    document.addEventListener("mouseover", function (e) {
      ring.classList.toggle("is-hover", !!e.target.closest(hoverSelector));
    });
  }

  /* ===== Footer year ===== */
  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();
