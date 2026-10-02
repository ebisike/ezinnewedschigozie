/* =================================================================
   Ezinne & Chigozie — Wedding Prototype
   script.js — countdown, nav scroll, reveal, RSVP validation + toast
================================================================= */

(function () {
  "use strict";

  /* ---------- Countdown to 19 Dec 2026 ---------- */
  // var COUNTDOWN_DATE = new Date("2026-09-12T09:53:00").getTime();
  var COUNTDOWN_DATE = new Date("2026-12-19T10:00:00").getTime();

  var elDays = document.getElementById("cd-days");
  var elHours = document.getElementById("cd-hours");
  var elMinutes = document.getElementById("cd-minutes");
  var elSeconds = document.getElementById("cd-seconds");
  var countdownEl = document.querySelector(".countdown");
  var wedNowEl = document.getElementById("wedNow");

  function pad(num, len) {
    var s = String(num);
    while (s.length < (len || 2)) s = "0" + s;
    return s;
  }

  function showWedNow() {
    if (countdownEl) countdownEl.hidden = true;
    if (wedNowEl) wedNowEl.hidden = false;
  }

  var countdownTimer = null;

  function updateCountdown() {
    var now = Date.now();
    var diff = COUNTDOWN_DATE - now;

    if (isNaN(COUNTDOWN_DATE)) return;

    if (diff <= 0) {
      showWedNow();
      if (countdownTimer) {
        clearInterval(countdownTimer);
        countdownTimer = null;
      }
      return;
    }

    var d = Math.floor(diff / 86400000);
    var h = Math.floor((diff % 86400000) / 3600000);
    var m = Math.floor((diff % 3600000) / 60000);
    var s = Math.floor((diff % 60000) / 1000);

    if (elDays) elDays.textContent = String(d);
    if (elHours) elHours.textContent = pad(h, 2);
    if (elMinutes) elMinutes.textContent = pad(m, 2);
    if (elSeconds) elSeconds.textContent = pad(s, 2);
  }

  updateCountdown();
  countdownTimer = setInterval(updateCountdown, 1000);

  /* ---------- Navbar scrolled state ---------- */
  var nav = document.getElementById("mainNav");
  function onScroll() {
    if (!nav) return;
    if (window.scrollY > 40) nav.classList.add("scrolled");
    else nav.classList.remove("scrolled");
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Reveal on scroll (IntersectionObserver) ---------- */
  var revealEls = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    revealEls.forEach(function (el) {
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("visible");
    });
  }

  /* ---------- Country + State dropdowns ---------- */
  var statesByCountry = {
    Nigeria: [
      "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue",
      "Borno", "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu",
      "FCT - Abuja", "Gombe", "Imo", "Jigawa", "Kaduna", "Kano", "Katsina",
      "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo",
      "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara"
    ],
    "United States": [
      "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado",
      "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho",
      "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana",
      "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota",
      "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada",
      "New Hampshire", "New Jersey", "New Mexico", "New York",
      "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon",
      "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
      "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington",
      "West Virginia", "Wisconsin", "Wyoming"
    ],
    "United Kingdom": [
      "England - Greater London", "England - South East", "England - South West",
      "England - West Midlands", "England - North West", "England - Yorkshire",
      "England - East Midlands", "England - East of England", "England - North East",
      "Scotland", "Wales", "Northern Ireland"
    ],
    Canada: [
      "Alberta", "British Columbia", "Manitoba", "New Brunswick",
      "Newfoundland and Labrador", "Nova Scotia", "Ontario",
      "Prince Edward Island", "Quebec", "Saskatchewan",
      "Northwest Territories", "Nunavut", "Yukon"
    ],
    Ghana: [
      "Greater Accra", "Ashanti", "Western", "Central", "Eastern",
      "Volta", "Northern", "Upper East", "Upper West", "Bono",
      "Bono East", "Ahafo", "Oti", "Western North", "Savannah",
      "North East"
    ],
    "South Africa": [
      "Eastern Cape", "Free State", "Gauteng", "KwaZulu-Natal", "Limpopo",
      "Mpumalanga", "North West", "Northern Cape", "Western Cape"
    ]
  };

  var countrySelect = document.getElementById("country");
  var stateSelect = document.getElementById("state");

  if (countrySelect && stateSelect) {
    Object.keys(statesByCountry).forEach(function (c) {
      var opt = document.createElement("option");
      opt.value = c;
      opt.textContent = c;
      countrySelect.appendChild(opt);
    });

    countrySelect.addEventListener("change", function () {
      var country = countrySelect.value;
      stateSelect.innerHTML = "";
      if (!country || !statesByCountry[country]) {
        var ph = document.createElement("option");
        ph.value = "";
        ph.textContent = "Select country first…";
        ph.disabled = true;
        ph.selected = true;
        stateSelect.appendChild(ph);
        stateSelect.disabled = true;
        return;
      }
      var placeholder = document.createElement("option");
      placeholder.value = "";
      placeholder.textContent = "Select state…";
      placeholder.disabled = true;
      placeholder.selected = true;
      stateSelect.appendChild(placeholder);
      statesByCountry[country].forEach(function (st) {
        var opt = document.createElement("option");
        opt.value = st;
        opt.textContent = st;
        stateSelect.appendChild(opt);
      });
      stateSelect.disabled = false;
      stateSelect.classList.remove("is-valid");
      stateSelect.classList.remove("is-invalid");
    });
  }

  /* ---------- RSVP validation + submit to server ---------- */
  var form = document.getElementById("rsvpForm");
  var toastEl = document.getElementById("rsvpToast");
  var toastMsg = document.getElementById("toastMsg");
  var submitBtn = form ? form.querySelector('button[type="submit"]') : null;

  function resetStateDropdown() {
    if (stateSelect) {
      stateSelect.innerHTML = "";
      var ph = document.createElement("option");
      ph.value = "";
      ph.textContent = "Select country first…";
      ph.disabled = true;
      ph.selected = true;
      stateSelect.appendChild(ph);
      stateSelect.disabled = true;
    }
    if (countrySelect) {
      countrySelect.value = "";
    }
  }

  function showToast(message) {
    if (toastMsg) toastMsg.textContent = message;
    if (toastEl && window.bootstrap && bootstrap.Toast) {
      bootstrap.Toast.getOrCreateInstance(toastEl, { delay: 4500 }).show();
    }
  }

  function setSubmitting(sending) {
    if (!submitBtn) return;
    submitBtn.disabled = sending;
    if (sending) {
      submitBtn.dataset.originalHtml = submitBtn.innerHTML;
      submitBtn.innerHTML = '<i class="bi bi-hourglass-split me-2"></i>Sending…';
    } else if (submitBtn.dataset.originalHtml) {
      submitBtn.innerHTML = submitBtn.dataset.originalHtml;
    }
  }

  if (form) {
    form.addEventListener(
      "submit",
      function (event) {
        event.preventDefault();
        if (!form.checkValidity()) {
          event.stopPropagation();
          form.classList.add("was-validated");
          var firstInvalid = form.querySelector(":invalid");
          if (firstInvalid) {
            firstInvalid.focus({ preventScroll: false });
          }
          return;
        }

        var payload = {
          firstName: document.getElementById("firstName").value,
          lastName: document.getElementById("lastName").value,
          phone: document.getElementById("phone").value,
          attending: document.getElementById("attending").value,
          country: countrySelect ? countrySelect.value : "",
          state: stateSelect ? stateSelect.value : "",
          message: document.getElementById("message").value
        };

        setSubmitting(true);

        if (!window.WED_FIREBASE_READY || typeof firebase === "undefined") {
          setSubmitting(false);
          showToast(
            "RSVP storage is not configured yet — the couple needs to add their Firebase keys."
          );
          return;
        }

        firebase
          .firestore()
          .collection("rsvps")
          .add({
            firstName: payload.firstName,
            lastName: payload.lastName,
            phone: payload.phone,
            attending: payload.attending,
            country: payload.country,
            state: payload.state,
            message: payload.message,
            submittedAt: firebase.firestore.FieldValue.serverTimestamp()
          })
          .then(function () {
            setSubmitting(false);
            showToast(
              "Thank you " + payload.firstName + "! Your RSVP has been received."
            );
            form.reset();
            form.classList.remove("was-validated");
            resetStateDropdown();
          })
          .catch(function (err) {
            console.error("RSVP save failed:", err);
            setSubmitting(false);
            showToast(
              "Sorry " + payload.firstName + ", we couldn't save your RSVP. Please try again."
            );
          });
      },
      false
    );
  }

  /* ---------- Navbar: close collapse on link click (mobile) ---------- */
  var navCollapse = document.getElementById("navLinks");
  if (navCollapse) {
    navCollapse.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener("click", function () {
        if (navCollapse.classList.contains("show") && window.bootstrap && bootstrap.Collapse) {
          bootstrap.Collapse.getOrCreateInstance(navCollapse).hide();
        }
      });
    });
  }

  /* ---------- Copy bank account number ---------- */
  var copyBtn = document.getElementById("copyNumber");
  var bankNumberEl = document.getElementById("bankNumber");
  if (copyBtn && bankNumberEl) {
    copyBtn.addEventListener("click", function () {
      var prevText = bankNumberEl.textContent;
      var num = prevText.trim();
      var showDone = function () {
        copyBtn.classList.add("copied");
        bankNumberEl.textContent = "Copied!";
        setTimeout(function () {
          copyBtn.classList.remove("copied");
          bankNumberEl.textContent = prevText;
        }, 1800);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(num).then(showDone).catch(function () {
          fallbackCopy(num); showDone();
        });
      } else {
        fallbackCopy(num); showDone();
      }
    });
  }

  function fallbackCopy(text) {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand("copy"); } catch (e) {}
    document.body.removeChild(ta);
  }

  /* ---------- "How well do you know us" video modal ---------- */
  var videoCards = document.querySelectorAll(".video-card");
  var videoModalEl = document.getElementById("videoModal");
  var videoPlayer = document.getElementById("videoPlayer");

  if (videoCards.length && videoModalEl && videoPlayer) {
    var modalInstance = window.bootstrap && bootstrap.Modal
      ? bootstrap.Modal.getOrCreateInstance(videoModalEl)
      : null;

    videoCards.forEach(function (card) {
      card.addEventListener("click", function () {
        var id = (card.getAttribute("data-video") || "").trim();
        if (!id) return;

        // Support either a bare YouTube video id or a full youtube URL.
        var match = id.match(/(?:shorts\/|embed\/|watch\?v=|youtu\.be\/)([A-Za-z0-9_-]{6,})/);
        var videoId = match ? match[1] : id;

        videoPlayer.src =
          "https://www.youtube.com/embed/" + videoId +
          "?autoplay=1&rel=0&modestbranding=1";

        if (modalInstance) {
          modalInstance.show();
        } else {
          videoModalEl.classList.add("show");
          videoModalEl.style.display = "block";
        }
      });
    });

    function stopVideo() {
      videoPlayer.src = "about:blank";
    }

    videoModalEl.addEventListener("hidden.bs.modal", stopVideo);
    videoModalEl.addEventListener("hide.bs.modal", stopVideo);
  }

  /* ---------- Wishes: equal-height clamp + Read more ---------- */
  function initWishCards() {
    var cards = document.querySelectorAll(".wish-card");
    cards.forEach(function (card) {
      if (card.dataset.readMoreInit === "1") return;
      var text = card.querySelector(".wish-text");
      if (!text) return;

      // Only long wishes get the button (short ones already fit the clamp).
      if (text.scrollHeight <= text.clientHeight + 4) return;

      card.dataset.readMoreInit = "1";
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "btn-read-more";
      btn.setAttribute("aria-expanded", "false");
      btn.textContent = "Read more";
      card.appendChild(btn);

      btn.addEventListener("click", function () {
        var expanded = card.classList.toggle("expanded");
        btn.textContent = expanded ? "Read less" : "Read more";
        btn.setAttribute("aria-expanded", expanded ? "true" : "false");
      });
    });
  }

  initWishCards();
  // Re-check once webfonts have loaded (heights shift after the font swap).
  if (document.fonts && document.fonts.ready && document.fonts.ready.then) {
    document.fonts.ready.then(function () {
      var cards = document.querySelectorAll(".wish-card");
      cards.forEach(function (card) {
        var text = card.querySelector(".wish-text");
        if (!text) return;
        if (text.scrollHeight > text.clientHeight + 4) initWishCards();
      });
    });
  }
  window.addEventListener("load", initWishCards);
})();