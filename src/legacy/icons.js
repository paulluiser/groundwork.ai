/* Kern icons: one line set drawn to match the topbar icons (24px grid, 1.6 stroke, round caps, currentColor).
   GW.icon(name, cls) returns inline SVG markup. Icons are decorative; the text beside them carries the meaning. */
window.GW = window.GW || {};
(function () {
  "use strict";
  var P = {
    clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
    list: '<path d="M9 6.5h11M9 12h11M9 17.5h11M4.5 6.5h.01M4.5 12h.01M4.5 17.5h.01"/>',
    flask: '<path d="M9 3.5h6M10 3.5V9l-5.3 9.3A1.8 1.8 0 0 0 6.3 21h11.4a1.8 1.8 0 0 0 1.6-2.7L14 9V3.5M7.2 15h9.6"/>',
    help: '<circle cx="12" cy="12" r="8.5"/><path d="M9.6 9.3a2.5 2.5 0 0 1 4.9.6c0 1.7-2.5 2.1-2.5 3.6M12 16.8h.01"/>',
    book: '<path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H10a2 2 0 0 1 2 2v14a2 2 0 0 0-2-2H4zM20 5.5A1.5 1.5 0 0 0 18.5 4H14a2 2 0 0 0-2 2v14a2 2 0 0 1 2-2h6z"/>',
    bulb: '<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.6 10.8c.7.6 1.1 1.3 1.1 2.2h5c0-.9.4-1.6 1.1-2.2A6 6 0 0 0 12 3z"/>',
    task: '<rect x="4" y="5" width="16" height="15.5" rx="2.5"/><path d="M8.5 3v4M15.5 3v4M4 10h16M9.3 15l2 2 3.7-3.8"/>',
    target: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r=".6"/>',
    play: '<path d="M8 5.2v13.6a.8.8 0 0 0 1.2.7l10.6-6.8a.8.8 0 0 0 0-1.4L9.2 4.5a.8.8 0 0 0-1.2.7z"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    back: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    x: '<path d="M6.5 6.5l11 11M17.5 6.5l-11 11"/>',
    good: '<circle cx="12" cy="12" r="8.5"/><path d="M8.3 12.4l2.5 2.5 5-5.2"/>',
    care: '<path d="M10.6 4.3 3 17.6A1.6 1.6 0 0 0 4.4 20h15.2a1.6 1.6 0 0 0 1.4-2.4L13.4 4.3a1.6 1.6 0 0 0-2.8 0zM12 9.5v4M12 16.6h.01"/>',
    human: '<circle cx="12" cy="8" r="3.8"/><path d="M4.5 20.5a7.5 7.5 0 0 1 15 0"/>',
    search: '<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/>',
    split: '<circle cx="6" cy="5" r="2"/><circle cx="18" cy="5" r="2"/><circle cx="12" cy="19.5" r="2"/><path d="M6 7v1.5a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3V7M12 11.5v6"/>',
    sim: '<rect x="6" y="6" width="12" height="12" rx="2.5"/><path d="M9.5 2.5V6M14.5 2.5V6M9.5 18v3.5M14.5 18v3.5M2.5 9.5H6M2.5 14.5H6M18 9.5h3.5M18 14.5h3.5"/>',
    pencil: '<path d="M4 20h4L19.2 8.8a2.3 2.3 0 0 0-3.2-3.2L4.8 16.8z"/><path d="M14 7.5l3.2 3.2"/>',
    chart: '<path d="M4 4v16h16M8.5 16v-4M12.5 16V8M16.5 16v-6"/>',
    flow: '<rect x="3" y="4" width="6.5" height="6" rx="1.5"/><rect x="14.5" y="14" width="6.5" height="6" rx="1.5"/><path d="M9.5 7h3.5a2 2 0 0 1 2 2v5"/>',
    cycle: '<path d="M19.5 12a7.5 7.5 0 0 1-13.2 4.9M4.5 12a7.5 7.5 0 0 1 13.2-4.9M18 3.5v4h-4M6 20.5v-4h4"/>',
    timeline: '<path d="M7 3.5v17"/><circle cx="7" cy="7" r="1.6"/><circle cx="7" cy="12" r="1.6"/><circle cx="7" cy="17" r="1.6"/><path d="M11 7h9M11 12h6M11 17h8"/>',
    sliders: '<path d="M4 8h9M17 8h3M4 16h3M11 16h9"/><circle cx="15" cy="8" r="2"/><circle cx="9" cy="16" r="2"/>',
    grid: '<rect x="4" y="4" width="16" height="16" rx="2.5"/><path d="M12 4v16M4 12h16"/>',
    shield: '<path d="M12 3.2l7 2.8v5.6c0 4.3-2.9 7.6-7 9.2-4.1-1.6-7-4.9-7-9.2V6z"/>',
    layers: '<path d="M12 3.5 3.5 8 12 12.5 20.5 8zM3.5 12.5 12 17l8.5-4.5M3.5 16.5 12 21l8.5-4.5"/>',
    columns: '<rect x="3.5" y="4.5" width="17" height="15" rx="2.5"/><path d="M12 4.5v15"/>',
    pin: '<path d="M12 21s-6.5-5.6-6.5-11.2a6.5 6.5 0 0 1 13 0C18.5 15.4 12 21 12 21z"/><circle cx="12" cy="9.8" r="2.2"/>',
    trend: '<path d="M3.5 17 9 11.5l4 4 7.5-7.5M15 8h5.5v5.5"/>',
    steps: '<path d="M4 19h5v-5h5V9h6"/><path d="M4 19v-3"/>',
    terminal: '<rect x="3.5" y="4.5" width="17" height="15" rx="2.5"/><path d="M7.5 9.5l3 2.5-3 2.5M12.5 15h4"/>',
    check2: '<rect x="4" y="4" width="16" height="16" rx="4"/><path d="M8.5 12.2l2.4 2.4 4.8-5"/>'
  };
  GW.icon = function (name, cls) {
    return '<svg class="ic' + (cls ? " " + cls : "") + '" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' + (P[name] || "") + "</svg>";
  };
})();
