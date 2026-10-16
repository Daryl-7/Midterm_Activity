(function () {
  var d = document,
    root = d.documentElement;
  root.classList.add("js");
  var nav = d.getElementById("nav"),
    menu = d.getElementById("menu");
  menu.addEventListener("click", function () {
    var o = nav.classList.toggle("open");
    menu.setAttribute("aria-expanded", o);
  });
  d.querySelectorAll(".links a").forEach(function (a) {
    a.addEventListener("click", function () {
      nav.classList.remove("open");
      menu.setAttribute("aria-expanded", "false");
    });
  });

  var rm = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var els = d.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !rm) {
    var io = new IntersectionObserver(
      function (es) {
        es.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 },
    );
    els.forEach(function (el) {
      io.observe(el);
    });
  } else
    els.forEach(function (el) {
      el.classList.add("in");
    });

  var dc = d.getElementById("dc"),
    dcv = d.getElementById("dcv");
  dc.addEventListener("click", function () {
    var done = function () {
      dcv.textContent = "Copied!";
      setTimeout(function () {
        dcv.textContent = ".ryl__ (click to copy)";
      }, 1600);
    };
    try {
      navigator.clipboard.writeText(dc.dataset.copy).then(done, done);
    } catch (e) {
      done();
    }
  });

  if (matchMedia("(hover: hover) and (pointer: fine)").matches) {
    var dot = d.getElementById("dot"),
      ring = d.getElementById("ring");
    var x = -100,
      y = -100,
      rx = -100,
      ry = -100;
    root.classList.add("has-cursor");
    d.addEventListener("mousemove", function (e) {
      x = e.clientX;
      y = e.clientY;
      dot.classList.add("on");
      ring.classList.add("on");
      var t = e.target,
        dark = !!t.closest(".dark");
      dot.classList.toggle("on-dark", dark);
      ring.classList.toggle("on-dark", dark);
      ring.classList.toggle("big", !!t.closest("a,button,.card,.tags li"));
    });
    d.addEventListener("mouseleave", function () {
      dot.classList.remove("on");
      ring.classList.remove("on");
    });
    (function loop() {
      rx += (x - rx) * 0.18;
      ry += (y - ry) * 0.18;
      dot.style.transform = "translate(" + x + "px," + y + "px)";
      ring.style.transform = "translate(" + rx + "px," + ry + "px)";
      requestAnimationFrame(loop);
    })();
  }
})();
