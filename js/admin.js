/* =================================================================
   Admin Dashboard — Ezinne & Chigozie Wedding Prototype
   Passcode gate + RSVP list from Firebase Firestore
================================================================= */

(function () {
  "use strict";

  var ADMIN_PASSCODE = "050597";  // client-side gate (prototype-grade)
  var currentPasscode = "";       // in-memory only — refresh always re-prompts
  var gate = document.getElementById("gate");
  var gateForm = document.getElementById("gateForm");
  var passcodeInput = document.getElementById("passcode");
  var gateError = document.getElementById("gateError");
  var dashboard = document.getElementById("dashboard");
  var tableBody = document.getElementById("tableBody");
  var searchInput = document.getElementById("searchInput");
  var filterSelect = document.getElementById("filterSelect");
  var refreshBtn = document.getElementById("refreshBtn");
  var exportBtn = document.getElementById("exportBtn");
  var lockBtn = document.getElementById("lockBtn");
  var statTotal = document.getElementById("statTotal");
  var statAttending = document.getElementById("statAttending");
  var statDeclined = document.getElementById("statDeclined");
  var statLatest = document.getElementById("statLatest");
  var countBadge = document.getElementById("countBadge");

  var rsvps = [];
  var unlocked = false;

  /* ---------- helpers ---------- */
  function pad2(n) { return n < 10 ? "0" + n : String(n); }

  /* Handles Firestore Timestamp objects as well as ISO strings. */
  function asDate(value) {
    if (value && typeof value.toDate === "function") return value.toDate();
    return new Date(value);
  }

  function formatDate(value) {
    var d = asDate(value);
    if (isNaN(d.getTime())) return "—";
    return (
      d.getFullYear() + "-" + pad2(d.getMonth() + 1) + "-" + pad2(d.getDate()) +
      " " + pad2(d.getHours()) + ":" + pad2(d.getMinutes())
    );
  }

  function escapeHtml(str) {
    return String(str == null ? "" : str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  /* ---------- gate ---------- */
  function unlock(passcode) {
    if (passcode !== ADMIN_PASSCODE) {
      showGateError();
      return;
    }
    if (!window.WED_FIREBASE_READY || typeof firebase === "undefined") {
      showGateError("Firebase is not configured yet — edit js/firebase-config.js.");
      return;
    }
    loadRsvps()
      .then(function (data) {
        unlocked = true;
        currentPasscode = passcode;
        rsvps = data;
        gate.hidden = true;
        dashboard.hidden = false;
        render();
      })
      .catch(function (err) {
        console.error(err);
        showGateError("Could not load submissions. Check your connection and Firebase setup.");
      });
  }

  function showGateError(msg) {
    if (gateError) {
      gateError.textContent = "";
      gateError.innerHTML =
        '<i class="bi bi-exclamation-triangle-fill me-1"></i>' +
        escapeHtml(msg || "Wrong passcode. Try again.");
      gateError.hidden = false;
    }
    if (passcodeInput) {
      passcodeInput.value = "";
      passcodeInput.focus();
    }
  }

  if (gateForm) {
    gateForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var code = passcodeInput ? passcodeInput.value.trim() : "";
      if (!code) return;
      unlock(code);
    });
  }

  if (lockBtn) {
    lockBtn.addEventListener("click", function () {
      unlocked = false;
      currentPasscode = "";
      rsvps = [];
      dashboard.hidden = true;
      gate.hidden = false;
      if (gateError) gateError.hidden = true;
      if (passcodeInput) { passcodeInput.value = ""; passcodeInput.focus(); }
    });
  }

  /* ---------- data fetch (Firestore) ---------- */
  function loadRsvps() {
    return firebase
      .firestore()
      .collection("rsvps")
      .orderBy("submittedAt", "desc")
      .limit(500)
      .get()
      .then(function (snap) {
        return snap.docs.map(function (doc) {
          var r = doc.data();
          r.id = doc.id;
          return r;
        });
      });
  }

  function refresh() {
    if (!unlocked) return;
    loadRsvps()
      .then(function (data) {
        rsvps = data;
        render();
      })
      .catch(function () {
        /* silent */
      });
  }

  if (refreshBtn) refreshBtn.addEventListener("click", refresh);

  /* ---------- render ---------- */
  function visibleRsvps() {
    var q = (searchInput ? searchInput.value : "").trim().toLowerCase();
    var filter = filterSelect ? filterSelect.value : "all";
    return rsvps.filter(function (r) {
      if (filter !== "all" && r.attending !== filter) return false;
      if (!q) return true;
      return [r.firstName, r.lastName, r.phone, r.country, r.state, r.message]
        .join(" ")
        .toLowerCase()
        .indexOf(q) !== -1;
    });
  }

  function render() {
    var list = rsvps.slice().sort(function (a, b) {
      return asDate(b.submittedAt) - asDate(a.submittedAt);
    });

    var total = list.length;
    var attending = 0;
    var declined = 0;
    list.forEach(function (r) {
      if (r.attending === "yes") attending++;
      else if (r.attending === "no") declined++;
    });

    if (statTotal) statTotal.textContent = String(total);
    if (statAttending) statAttending.textContent = String(attending);
    if (statDeclined) statDeclined.textContent = String(declined);
    if (statLatest) statLatest.textContent = total ? formatDate(list[0].submittedAt) : "—";
    if (countBadge) countBadge.textContent = total + (total === 1 ? " submission" : " submissions");

    var filtered = visibleRsvps();
    if (!tableBody) return;

    if (!filtered.length) {
      tableBody.innerHTML =
        '<tr class="admin-empty-row"><td colspan="8">' +
        (total ? "No matches for your search." : "No submissions yet. RSVPs will appear here.") +
        "</td></tr>";
      return;
    }

    var html = "";
    filtered.forEach(function (r, i) {
      var attendingPill =
        r.attending === "yes"
          ? '<span class="attend-pill attend-yes">Yes</span>'
          : '<span class="attend-pill attend-no">No</span>';
      var msg = r.message
        ? '<span class="msg-text">' + escapeHtml(r.message) + "</span>"
        : '<span class="msg-text">—</span>';
      html +=
        "<tr>" +
        '<td data-label="#">' + (i + 1) + "</td>" +
        '<td data-label="Name"><strong>' + escapeHtml(r.firstName) + " " + escapeHtml(r.lastName) + "</strong></td>" +
        '<td data-label="Phone">' + escapeHtml(r.phone) + "</td>" +
        '<td data-label="Attending">' + attendingPill + "</td>" +
        '<td data-label="Country">' + escapeHtml(r.country) + "</td>" +
        '<td data-label="State">' + escapeHtml(r.state) + "</td>" +
        '<td data-label="Message" class="msg-cell">' + msg + "</td>" +
        '<td data-label="Submitted" class="submitted-cell"><strong>' + formatDate(r.submittedAt) + "</strong></td>" +
        "</tr>";
    });
    tableBody.innerHTML = html;
  }

  if (searchInput) searchInput.addEventListener("input", render);
  if (filterSelect) filterSelect.addEventListener("change", render);

  /* ---------- CSV export ---------- */
  function csvCell(v) {
    var s = String(v == null ? "" : v);
    if (/[",\n]/.test(s)) s = '"' + s.replace(/"/g, '""') + '"';
    return s;
  }

  if (exportBtn) {
    exportBtn.addEventListener("click", function () {
      var rows = [["#", "First name", "Last name", "Phone", "Attending", "Country", "State", "Message", "Submitted at"]];
      rsvps
        .slice()
        .sort(function (a, b) { return asDate(b.submittedAt) - asDate(a.submittedAt); })
        .forEach(function (r, i) {
          rows.push([
            i + 1, r.firstName, r.lastName, r.phone,
            r.attending === "yes" ? "Yes" : "No",
            r.country, r.state, r.message, formatDate(r.submittedAt)
          ]);
        });

      var csv = rows.map(function (row) { return row.map(csvCell).join(","); }).join("\r\n");
      var blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
      var url = URL.createObjectURL(blob);
      var a = document.createElement("a");
      a.href = url;
      a.download = "rsvps-" + new Date().toISOString().slice(0, 10) + ".csv";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  }

  /* On load: always show the passcode gate (refresh re-prompts). */
  if (passcodeInput) passcodeInput.focus();
})();