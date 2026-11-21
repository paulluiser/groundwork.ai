/* Loading states built from the Kern mark.
   GW.loader(label): the two slashes drawing in turn, for waits of unknown length.
   GW.skeleton(kind): shimmering placeholder blocks shaped like the content that is coming.
   GW.bootDone(): fades out the first-load logo reveal once the app has painted. */
window.GW = window.GW || {};
(function () {
  "use strict";
  var MARK = '<svg viewBox="0 0 32 32" aria-hidden="true"><line class="s1" x1="8" y1="5" x2="15" y2="27" pathLength="100"/><line class="s2" x1="17" y1="5" x2="24" y2="27" pathLength="100"/></svg>';
  GW.loader = function (label, size) {
    return '<span class="kload' + (size ? " " + size : "") + '" role="status">' + MARK + '<span class="sr-only">' + (label || "Loading") + "</span></span>";
  };
  var B = function (cls) { return '<span class="sk-b ' + cls + '"></span>'; };
  GW.skeleton = function (kind) {
    if (kind === "square") return '<div class="sk sk-square" aria-hidden="true">' + B("fill") + "</div>";
    var h = '<div class="sk" aria-hidden="true">' + B("eye") + B("h1") + B("ln") + B("ln short") + '<div class="sk-grid">';
    for (var i = 0; i < 3; i++) h += '<div class="sk-card">' + B("ln tag") + B("ln") + B("ln") + B("ln short") + "</div>";
    return h + "</div></div>";
  };

  // First-load reveal: hold the mark until it has drawn (about a second) and the fonts are in, then fade.
  var boot = document.getElementById("boot"), finished = false;
  GW.bootDone = function () {
    if (finished) return; finished = true;
    var on = document.documentElement.classList.contains("boot-on");
    if (!boot || !on) { if (boot) boot.remove(); return; }
    var reduced = matchMedia("(prefers-reduced-motion: reduce)").matches, min = reduced ? 250 : 1150;
    var fonts = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
    var cap = new Promise(function (ok) { setTimeout(ok, 2500); });
    Promise.race([fonts, cap]).then(function () {
      setTimeout(function () {
        boot.classList.add("out");
        setTimeout(function () { boot.remove(); document.documentElement.classList.remove("boot-on"); }, 450);
      }, Math.max(0, min - performance.now()));
    });
  };
  // if the reveal has finished and the app still isn't ready, the mark turns into the loader
  if (boot) setTimeout(function () { if (!finished && boot.isConnected) boot.classList.add("wait"); }, 1300);
})();
