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

  /* ---------- Video row: arrows + mouse drag-to-swipe ---------- */
  var videoRow = document.querySelector(".video-grid");
  var videoPrev = document.querySelector(".video-arrow-prev");
  var videoNext = document.querySelector(".video-arrow-next");

  if (videoRow) {
    function videoStep(dir) {
      var card = videoRow.querySelector(".video-card");
      var w = card ? card.offsetWidth + 20 : videoRow.clientWidth * 0.8;
      videoRow.scrollBy({ left: dir * w, behavior: "smooth" });
    }
    if (videoPrev) videoPrev.addEventListener("click", function () { videoStep(-1); });
    if (videoNext) videoNext.addEventListener("click", function () { videoStep(1); });

    // Desktop: hold and drag to swipe (touch devices scroll natively).
    var dragging = false;
    var dragMoved = false;
    var dragStartX = 0;
    var dragStartScroll = 0;

    videoRow.addEventListener("pointerdown", function (e) {
      if (e.pointerType !== "mouse") return;
      dragging = true;
      dragMoved = false;
      dragStartX = e.clientX;
      dragStartScroll = videoRow.scrollLeft;
      videoRow.classList.add("dragging");
    });

    window.addEventListener("pointermove", function (e) {
      if (!dragging) return;
      var dx = e.clientX - dragStartX;
      if (Math.abs(dx) > 6) dragMoved = true;
      videoRow.scrollLeft = dragStartScroll - dx;
    });

    window.addEventListener("pointerup", function () {
      if (!dragging) return;
      dragging = false;
      videoRow.classList.remove("dragging");
    });

    // Don't open the video modal if the click was really the end of a drag.
    videoRow.addEventListener("click", function (e) {
      if (dragMoved) {
        e.preventDefault();
        e.stopPropagation();
        dragMoved = false;
      }
    }, true);
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

  /* ---------- Wishes: read aloud (per wish, pause/resume) ---------- */
  var speakCards = document.querySelectorAll(".wish-card");
  var synth = window.speechSynthesis;

  if (synth && speakCards.length) {
    var activeSpeak = null; // the btn currently reading
    var activeText = "";

    // voice speeds — calm default, faster options
    var SPEEDS = [0.75, 0.9, 1, 1.15, 1.3, 1.5];
    var speedIndex = 1; // 0.9× calm
    var speedLabel = document.getElementById("readSpeedLabel");

    // prefer a female English voice
    var femaleVoice = null;
    function pickFemaleVoice() {
      var voices = synth.getVoices() || [];
      if (!voices.length) return null;
      var prefer = [
        "Google UK English Female",
        "Microsoft Aria", "Microsoft Jenny", "Microsoft Michelle",
        "Microsoft Zira", "Microsoft Hazel", "Microsoft Susan",
        "Samantha", "Karen", "Moira", "Tessa", "Fiona", "Serena", "Veena"
      ];
      var en = voices.filter(function (v) { return /^en/i.test(v.lang); });
      var pool = en.length ? en : voices;
      for (var p = 0; p < prefer.length; p++) {
        for (var v = 0; v < pool.length; v++) {
          if (pool[v].name.indexOf(prefer[p]) > -1) return pool[v];
        }
      }
      for (var f = 0; f < pool.length; f++) {
        if (/female/i.test(pool[f].name)) return pool[f];
      }
      return pool[0];
    }
    femaleVoice = pickFemaleVoice();
    if (typeof synth.onvoiceschanged !== "undefined") {
      synth.onvoiceschanged = function () {
        femaleVoice = pickFemaleVoice();
      };
    }

    function setSpeakState(btn, state) {
      var icon = btn.querySelector("i");
      btn.classList.remove("is-speaking");
      btn.dataset.state = state;
      if (state === "speaking") {
        icon.className = "bi bi-pause-fill";
        btn.classList.add("is-speaking");
        btn.setAttribute("aria-label", "Pause reading");
        btn.title = "Pause reading";
      } else if (state === "paused") {
        icon.className = "bi bi-play-fill";
        btn.setAttribute("aria-label", "Resume reading");
        btn.title = "Resume reading";
      } else {
        icon.className = "bi bi-volume-up-fill";
        btn.setAttribute("aria-label", "Read this wish aloud");
        btn.title = "Read aloud";
      }
    }

    function stopSpeaking() {
      if (activeSpeak) {
        setSpeakState(activeSpeak, "idle");
        activeSpeak = null;
        activeText = "";
      }
      try { synth.cancel(); } catch (e) {}
    }

    function speakWish(btn, text) {
      var utter = new SpeechSynthesisUtterance(text);
      if (femaleVoice) utter.voice = femaleVoice;
      utter.rate = SPEEDS[speedIndex];
      utter.pitch = 1;
      utter.onend = function () {
        if (activeSpeak === btn) stopSpeaking();
      };
      utter.onerror = function () {
        if (activeSpeak === btn) stopSpeaking();
      };
      activeSpeak = btn;
      activeText = text;
      setSpeakState(btn, "speaking");
      synth.speak(utter);
    }

    function wishText(el) {
      return (el.textContent || "").trim()
        .replace(/^["\u201C]+/, "")
        .replace(/["\u201D]+$/, "");
    }

    speakCards.forEach(function (card) {
      var textEl = card.querySelector(".wish-text");
      if (!textEl) return;

      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "btn-speak";
      btn.innerHTML = '<i class="bi bi-volume-up-fill"></i>';
      setSpeakState(btn, "idle");
      card.appendChild(btn);

      btn.addEventListener("click", function (e) {
        e.stopPropagation();

        var state = btn.dataset.state;
        if (state === "speaking") {
          synth.pause();
          setSpeakState(btn, "paused");
          return;
        }
        if (state === "paused") {
          activeSpeak = btn;
          synth.resume();
          setSpeakState(btn, "speaking");
          return;
        }

        // idle → start fresh (stops any other wish being read)
        stopSpeaking();
        speakWish(btn, wishText(textEl));
      });
    });

    // speed control — explicit slower / faster buttons
    var speedUpBtn = document.getElementById("speedUp");
    var speedDownBtn = document.getElementById("speedDown");

    function updateSpeedUi() {
      if (speedLabel) speedLabel.textContent = SPEEDS[speedIndex] + "×";
      if (speedUpBtn) speedUpBtn.disabled = speedIndex >= SPEEDS.length - 1;
      if (speedDownBtn) speedDownBtn.disabled = speedIndex <= 0;
    }

    function changeSpeed(dir) {
      var next = speedIndex + dir;
      if (next < 0 || next >= SPEEDS.length) return;
      speedIndex = next;
      updateSpeedUi();
      var wasReading = activeSpeak && activeText && (synth.speaking || synth.paused);
      var restartBtn = activeSpeak;
      var restartText = activeText;
      stopSpeaking();
      if (wasReading) speakWish(restartBtn, restartText);
    }

    if (speedUpBtn) speedUpBtn.addEventListener("click", function () { changeSpeed(1); });
    if (speedDownBtn) speedDownBtn.addEventListener("click", function () { changeSpeed(-1); });
    updateSpeedUi();

    // Chrome stops long utterances after ~15s unless nudged.
    setInterval(function () {
      if (synth.speaking && !synth.paused) {
        synth.pause();
        synth.resume();
      }
    }, 12000);

    window.addEventListener("beforeunload", function () {
      try { synth.cancel(); } catch (e) {}
    });
  }
  /* ---------- Gallery scrapbook — draggable polaroids ---------- */
  var scrapBoard = document.getElementById("scrapBoard");
  if (scrapBoard) {
    var polaroids = scrapBoard.querySelectorAll(".polaroid");
    var scrapZ = 1;

    // photo lightbox
    var photoModalEl = document.getElementById("photoModal");
    var photoViewer = document.getElementById("photoViewer");
    var photoPrevBtn = document.getElementById("photoPrev");
    var photoNextBtn = document.getElementById("photoNext");
    var photoModalInstance =
      photoModalEl && window.bootstrap && bootstrap.Modal
        ? bootstrap.Modal.getOrCreateInstance(photoModalEl)
        : null;

    var photoSrcs = [];
    var photoIndex = -1;
    polaroids.forEach(function (card) {
      var img = card.querySelector("img");
      if (img && img.src) photoSrcs.push(img.src);
    });

    function replayPhotoAnim() {
      if (!photoViewer) return;
      photoViewer.style.animation = "none";
      void photoViewer.offsetWidth;
      photoViewer.style.animation = "";
    }

    function showPhotoAt(i) {
      if (!photoSrcs.length || !photoViewer) return;
      photoIndex = ((i % photoSrcs.length) + photoSrcs.length) % photoSrcs.length;
      photoViewer.src = photoSrcs[photoIndex];
      replayPhotoAnim();
    }

    function openPhoto(src) {
      if (!src || !photoViewer) return;
      var idx = photoSrcs.indexOf(src);
      showPhotoAt(idx >= 0 ? idx : 0);
      if (photoModalInstance) {
        photoModalInstance.show();
      } else if (photoModalEl) {
        photoModalEl.classList.add("show");
        photoModalEl.style.display = "block";
      }
    }

    if (photoPrevBtn) {
      photoPrevBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        showPhotoAt(photoIndex - 1);
      });
    }
    if (photoNextBtn) {
      photoNextBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        showPhotoAt(photoIndex + 1);
      });
    }
    // tap the photo itself to advance
    if (photoViewer) {
      photoViewer.addEventListener("click", function () {
        showPhotoAt(photoIndex + 1);
      });
    }
    // arrow keys cycle while the lightbox is open
    document.addEventListener("keydown", function (e) {
      if (!photoModalEl || !photoModalEl.classList.contains("show")) return;
      if (e.key === "ArrowLeft") showPhotoAt(photoIndex - 1);
      else if (e.key === "ArrowRight") showPhotoAt(photoIndex + 1);
    });

    // hand-scattered starting arrangement: [x%, y%, rotation]
    var SCRAP_LAYOUT = [
      [2, 4, -6], [20, 0, 4], [38, 6, -3], [56, 1, 5], [74, 5, -5], [84, 10, 3],
      [6, 26, 5], [24, 22, -4], [43, 28, 6], [62, 24, -6], [80, 30, 4],
      [0, 48, 4], [18, 50, -5], [36, 52, 3], [55, 47, -4], [73, 52, 6],
      [10, 72, -4], [48, 74, 5]
    ];

    function placePolaroid(card, x, y, rot) {
      card.style.left = x + "%";
      card.style.top = y + "%";
      card.style.setProperty("--rot", rot + "deg");
      card.dataset.rot = rot;
    }

    // keep cards inside the (edge-to-edge) board
    function clampToBoard(card, xPct, yPct) {
      var bw = scrapBoard.clientWidth || 1;
      var ch = scrapBoard.clientHeight || 1;
      var cw = card.offsetWidth || 140;
      var chh = card.offsetHeight || 190;
      var maxX = Math.max(0, (bw - cw) / bw * 100);
      var maxY = Math.max(0, (ch - chh) / ch * 100);
      return [Math.min(xPct, maxX), Math.min(yPct, maxY)];
    }

    function layoutScrapbook() {
      for (var i = 0; i < polaroids.length; i++) {
        var spot = SCRAP_LAYOUT[i % SCRAP_LAYOUT.length];
        var pos = clampToBoard(polaroids[i], spot[0], spot[1]);
        placePolaroid(polaroids[i], pos[0], pos[1], spot[2]);
      }
    }
    layoutScrapbook();

    // re-clamp after images size up / window resizes
    var scrapResizeTimer = null;
    window.addEventListener("resize", function () {
      clearTimeout(scrapResizeTimer);
      scrapResizeTimer = setTimeout(function () {
        polaroids.forEach(function (card) {
          var x = parseFloat(card.style.left) || 0;
          var y = parseFloat(card.style.top) || 0;
          var pos = clampToBoard(card, x, y);
          placePolaroid(card, pos[0], pos[1], parseFloat(card.dataset.rot) || 0);
        });
      }, 150);
    });

    polaroids.forEach(function (card) {
      card.addEventListener("pointerdown", function (e) {
        e.preventDefault();
        try { card.setPointerCapture(e.pointerId); } catch (err) {}

        var boardRect = scrapBoard.getBoundingClientRect();
        var cardRect = card.getBoundingClientRect();
        var offX = e.clientX - cardRect.left;
        var offY = e.clientY - cardRect.top;
        var startX = e.clientX;
        var startY = e.clientY;
        var moved = false;

        card.classList.add("dragging");
        card.classList.remove("moving");
        card.style.zIndex = ++scrapZ;

        function onMove(ev) {
          if (Math.abs(ev.clientX - startX) > 6 || Math.abs(ev.clientY - startY) > 6) {
            moved = true;
          }
          var nx = ev.clientX - offX - boardRect.left;
          var ny = ev.clientY - offY - boardRect.top;
          nx = Math.max(0, Math.min(nx, boardRect.width - cardRect.width));
          ny = Math.max(0, Math.min(ny, boardRect.height - cardRect.height));
          card.style.left = (nx / boardRect.width * 100) + "%";
          card.style.top = (ny / boardRect.height * 100) + "%";
        }
        function onUp() {
          card.classList.remove("dragging");
          card.removeEventListener("pointermove", onMove);
          card.removeEventListener("pointerup", onUp);
          card.removeEventListener("pointercancel", onUp);
          // a tap (not a drag) opens the photo full-size
          if (!moved) {
            var img = card.querySelector("img");
            if (img && img.src) openPhoto(img.src);
          }
        }
        card.addEventListener("pointermove", onMove);
        card.addEventListener("pointerup", onUp);
        card.addEventListener("pointercancel", onUp);
      });
    });

    var shuffleBtn = document.getElementById("shuffleBtn");
    if (shuffleBtn) {
      shuffleBtn.addEventListener("click", function () {
        polaroids.forEach(function (card) {
          card.classList.add("moving");
          var pos = clampToBoard(card, Math.random() * 80, Math.random() * 74);
          var rot = Math.random() * 20 - 10;
          placePolaroid(card, pos[0], pos[1], rot);
        });
        setTimeout(function () {
          polaroids.forEach(function (card) { card.classList.remove("moving"); });
        }, 550);
      });
    }
  }

  /* ---------- Theme picker (explore palettes) ---------- */
  var themePicker = document.getElementById("themePicker");
  var themePanel = document.getElementById("themePanel");
  var themePickerBtn = document.getElementById("themePickerBtn");
  var THEME_KEY = "ec-theme";

  if (themePicker && themePanel && themePickerBtn) {
    var themeTip = document.getElementById("themeTip");

    function applyTheme(name) {
      if (name) document.documentElement.setAttribute("data-theme", name);
      else document.documentElement.removeAttribute("data-theme");
      try { localStorage.setItem(THEME_KEY, name || ""); } catch (e) {}
      themePanel.querySelectorAll(".theme-chip").forEach(function (chip) {
        chip.classList.toggle("is-active", chip.getAttribute("data-theme") === (name || ""));
      });
    }

    // restore saved choice
    var savedTheme = "";
    try { savedTheme = localStorage.getItem(THEME_KEY) || ""; } catch (e) {}
    if (savedTheme) applyTheme(savedTheme);

    // animated "pick a palette" nudge — shows on every page load
    if (themeTip) {
      setTimeout(function () { themeTip.classList.add("show"); }, 2200);

      var hideThemeTip = function () {
        themeTip.classList.remove("show");
      };
      // auto-hide after a while
      var tipTimer = setTimeout(hideThemeTip, 15000);

      // clicking the tip opens the picker
      themeTip.addEventListener("click", function () {
        clearTimeout(tipTimer);
        hideThemeTip();
        themePickerBtn.click();
      });
      // opening the picker any other way dismisses it too
      themePickerBtn.addEventListener("click", hideThemeTip);
    }

    themePickerBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      themePanel.hidden = !themePanel.hidden;
    });

    themePanel.addEventListener("click", function (e) {
      var chip = e.target.closest(".theme-chip");
      if (!chip) return;
      applyTheme(chip.getAttribute("data-theme") || "");
      themePanel.hidden = true;
    });

    document.addEventListener("click", function (e) {
      if (!themePicker.contains(e.target)) themePanel.hidden = true;
    });
  }
})();