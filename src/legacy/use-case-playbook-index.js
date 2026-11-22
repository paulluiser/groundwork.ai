/* Adds the new use cases from the playbook files to the list, guides and details,
   then keeps each role's use cases ordered by fit: good, care, human. */
(function () {
  var pb = GW.ucPlaybook || {}, list = GW.useCases = GW.useCases || [];
  GW.ucGuides = GW.ucGuides || {}; GW.ucDetails = GW.ucDetails || {};
  Object.keys(pb).forEach(function (t) {
    var e = pb[t]; if (!e.nw) return;
    if (!list.some(function (u) { return u.t === t; })) list.push(Object.assign({ t: t, isNew: true }, e.nw));
    GW.ucGuides[t] = { s: e.s || [], y: e.y || [], n: e.n || [], t: e.tip, p: e.p };
    GW.ucDetails[t] = { w: e.w, f: e.f, x: e.x };
  });
  var roles = [], fit = { good: 0, care: 1, human: 2 };
  list.forEach(function (u) { if (roles.indexOf(u.r) < 0) roles.push(u.r); });
  var pos = new Map(list.map(function (u, i) { return [u, i]; }));
  list.sort(function (a, b) { return roles.indexOf(a.r) - roles.indexOf(b.r) || fit[a.fit] - fit[b.fit] || pos.get(a) - pos.get(b); });
})();
