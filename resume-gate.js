/* ─────────────────────────────────────────────────────────────────────
   Résumé request gate.

   Intercepts every link pointing at the résumé and opens a request form
   instead. Injects its own markup and styles, so adding it to a page is
   one script tag and nothing else.

   Submissions post straight to the Google Form configured below, so the
   visitor never leaves the page and never sees a Google interface.

   ── IF YOU EVER REBUILD THE FORM ──────────────────────────────────────
   The field ids come from the form's pre-filled link: form ⋮ menu →
   Get pre-filled link → fill each field → Get link. The URL contains an
   entry.NNNNNNNN for every question. Copy those into FIELDS, and point
   ENDPOINT at the same form id with /formResponse instead of /viewform.

   The browser cannot read Google's reply to a cross-origin post, so the
   form reports success once the request has been sent rather than once
   Google confirms it. The close screen tells the visitor to email
   directly if they hear nothing, which covers the rare miss.
   ──────────────────────────────────────────────────────────────────── */

(function () {
  "use strict";

  var ENDPOINT = "https://docs.google.com/forms/d/e/"
               + "1FAIpQLSf_zmTZbo679J47OUmvzvoJr1dyuV89uTFGBXcsrJTC0gjUHQ/formResponse";

  var FIELDS = {
    email:   "entry.1165067227",
    name:    "entry.1073749822",
    company: "entry.2127722631",
    about:   "entry.1309003600"
  };

  var TO = ["vedularahul89", "gmail.com"].join("@");

  /* ── styles ──────────────────────────────────────────────────────── */
  var css = ''
    + '.rg-scrim{position:fixed;inset:0;z-index:999;display:none;place-items:center;'
    + 'padding:1.5rem;background:rgba(22,25,15,.62);overflow-y:auto}'
    + '.rg-scrim.is-open{display:grid}'
    + '.rg{width:min(430px,100%);background:var(--paper-lift,#F1F2EC);border:2px solid var(--ink,#16190F);'
    + 'padding:1.5rem;position:relative;'
    + 'font-family:var(--sans,"Archivo",ui-sans-serif,-apple-system,"Segoe UI",Roboto,sans-serif);'
    + 'color:var(--ink,#16190F)}'
    + '.rg__k{font-family:var(--pixel,"Silkscreen",ui-monospace,monospace);font-size:.58rem;'
    + 'letter-spacing:.08em;color:var(--ink-faint,#8D9283);margin:0 0 .7rem}'
    + '.rg h2{font-size:1.32rem;font-weight:700;letter-spacing:-.022em;line-height:1.2;margin:0 0 .7rem}'
    + '.rg p{font-size:.95rem;line-height:1.55;color:var(--ink-soft,#5C6152);margin:0 0 1.2rem}'
    + '.rg label{display:block;font-family:var(--pixel,"Silkscreen",ui-monospace,monospace);'
    + 'font-size:.55rem;letter-spacing:.08em;color:var(--ink-faint,#8D9283);margin:0 0 .35rem}'
    + '.rg input,.rg textarea{width:100%;font:inherit;font-size:.95rem;padding:.55rem .6rem;'
    + 'border:2px solid var(--ink,#16190F);background:var(--paper,#E8EAE1);color:inherit;'
    + 'border-radius:0;margin:0 0 .9rem;display:block}'
    + '.rg textarea{resize:vertical;min-height:4rem}'
    + '.rg label span{color:var(--hit,#C8322A)}'
    + '.rg__two{display:grid;grid-template-columns:1fr 1fr;gap:0 .7rem}'
    + '.rg input:focus,.rg textarea:focus{outline:3px solid var(--hit,#C8322A);outline-offset:2px}'
    + '.rg__row{display:flex;gap:.6rem;align-items:center;margin-top:.3rem}'
    + '.rg__go{font-family:var(--pixel,"Silkscreen",ui-monospace,monospace);font-size:.62rem;'
    + 'letter-spacing:.06em;border:2px solid var(--ink,#16190F);background:var(--ink,#16190F);'
    + 'color:var(--paper-lift,#F1F2EC);padding:.6rem .8rem;cursor:pointer;border-radius:0}'
    + '.rg__go:hover{background:var(--hit,#C8322A);border-color:var(--hit,#C8322A);color:#fff}'
    + '.rg__go[disabled]{opacity:.55;cursor:default}'
    + '.rg__x{background:none;border:0;cursor:pointer;font-size:.86rem;color:var(--ink-faint,#8D9283);'
    + 'text-decoration:underline;text-underline-offset:3px;padding:0;font-family:inherit}'
    + '.rg__x:hover{color:var(--ink,#16190F)}'
    + '.rg__note{font-size:.8rem;color:var(--ink-faint,#8D9283);margin:1rem 0 0;line-height:1.45}'
    + '.rg__err{font-size:.86rem;color:var(--hit,#C8322A);margin:.2rem 0 0}'
    + '.rg__tick{font-family:var(--pixel,"Silkscreen",ui-monospace,monospace);font-size:.62rem;'
    + 'letter-spacing:.07em;color:var(--hit,#C8322A);border:2px solid var(--hit,#C8322A);'
    + 'padding:.3rem .5rem;display:inline-block;margin-bottom:1rem}'
    + '@media (max-width:420px){.rg__two{grid-template-columns:1fr}}'
    + '@media (prefers-reduced-motion:no-preference){.rg{animation:rg-in .18s ease-out}'
    + '@keyframes rg-in{from{transform:translateY(8px);opacity:0}}}';

  var style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  /* ── markup ──────────────────────────────────────────────────────── */
  var scrim = document.createElement("div");
  scrim.className = "rg-scrim";
  scrim.setAttribute("role", "dialog");
  scrim.setAttribute("aria-modal", "true");
  scrim.setAttribute("aria-labelledby", "rg-title");
  scrim.innerHTML = ''
    + '<div class="rg">'
    +   '<div id="rg-form">'
    +     '<p class="rg__k">RESUME ON REQUEST</p>'
    +     '<h2 id="rg-title">Happy to send it over</h2>'
    +     '<p>If you are hiring, or looking for a consulting partner, leave your email and I will send my r\u00e9sum\u00e9 across.</p>'
    +     '<label for="rg-email">EMAIL <span>*</span></label>'
    +     '<input id="rg-email" type="email" autocomplete="email" placeholder="you@company.com" required />'
    +     '<div class="rg__two">'
    +       '<div><label for="rg-name">NAME</label>'
    +       '<input id="rg-name" type="text" autocomplete="name" placeholder="Optional" /></div>'
    +       '<div><label for="rg-co">COMPANY</label>'
    +       '<input id="rg-co" type="text" autocomplete="organization" placeholder="Optional" /></div>'
    +     '</div>'
    +     '<label for="rg-msg">WHAT IS IT ABOUT</label>'
    +     '<textarea id="rg-msg" placeholder="Optional. A role, a project, a conversation."></textarea>'
    +     '<p class="rg__err" id="rg-err" hidden></p>'
    +     '<div class="rg__row">'
    +       '<button class="rg__go" id="rg-send" type="button">SEND REQUEST</button>'
    +       '<button class="rg__x" id="rg-cancel" type="button">Not now</button>'
    +     '</div>'
    +     '<p class="rg__note">Only the email is needed. Your address is used to send the r\u00e9sum\u00e9 and nothing else.</p>'
    +   '</div>'
    +   '<div id="rg-done" hidden>'
    +     '<span class="rg__tick">REQUEST SENT</span>'
    +     '<h2>Thanks, I will be in touch</h2>'
    +     '<p>I send these by hand, usually within a day.</p>'
    +     '<div class="rg__row"><button class="rg__go" id="rg-close" type="button">CLOSE</button></div>'
    +     '<p class="rg__note">Nothing in a day or two? Write to '
    +       '<a href="mailto:' + TO + '">' + TO + '</a> and I will send it straight away.</p>'
    +   '</div>'
    + '</div>';
  document.body.appendChild(scrim);

  var $ = function (id) { return document.getElementById(id); };
  var lastFocus = null;

  function open(e) {
    if (e) e.preventDefault();
    lastFocus = document.activeElement;
    scrim.classList.add("is-open");
    document.body.style.overflow = "hidden";
    $("rg-email").focus();
  }

  function close() {
    scrim.classList.remove("is-open");
    document.body.style.overflow = "";
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  function succeed() {
    $("rg-form").hidden = true;
    $("rg-done").hidden = false;
    $("rg-close").focus();
  }

  /* posts without triggering a preflight, and without needing to read
     the reply, which a cross-origin request cannot do anyway */
  function post(data) {
    var body = new URLSearchParams();
    body.append(FIELDS.email,   data.email);
    body.append(FIELDS.name,    data.name);
    body.append(FIELDS.company, data.company);
    body.append(FIELDS.about,   data.about);

    if (window.fetch) {
      return fetch(ENDPOINT, { method: "POST", mode: "no-cors", body: body });
    }
    // older browsers: submit a real form into a hidden frame
    return new Promise(function (resolve) {
      var frame = document.createElement("iframe");
      frame.name = "rg-sink"; frame.style.display = "none";
      document.body.appendChild(frame);
      var f = document.createElement("form");
      f.action = ENDPOINT; f.method = "POST"; f.target = "rg-sink"; f.style.display = "none";
      body.forEach(function (v, k) {
        var i = document.createElement("input");
        i.type = "hidden"; i.name = k; i.value = v;
        f.appendChild(i);
      });
      document.body.appendChild(f);
      f.submit();
      setTimeout(resolve, 600);
    });
  }

  function send() {
    var email = $("rg-email").value.trim();
    var err = $("rg-err");
    err.hidden = true;

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      err.textContent = "That email address does not look right.";
      err.hidden = false;
      $("rg-email").focus();
      return;
    }

    var btn = $("rg-send");
    btn.disabled = true;
    btn.textContent = "SENDING";

    post({
      email:   email,
      name:    $("rg-name").value.trim(),
      company: $("rg-co").value.trim(),
      about:   $("rg-msg").value.trim()
    }).then(succeed).catch(succeed);   // the response is opaque either way
  }

  /* ── wiring ──────────────────────────────────────────────────────── */
  $("rg-send").addEventListener("click", send);
  $("rg-cancel").addEventListener("click", close);
  $("rg-close").addEventListener("click", close);
  scrim.addEventListener("click", function (e) { if (e.target === scrim) close(); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && scrim.classList.contains("is-open")) close();
  });
  $("rg-msg").addEventListener("keydown", function (e) {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) send();
  });
  ["rg-email", "rg-name", "rg-co"].forEach(function (id) {
    $(id).addEventListener("keydown", function (e) { if (e.key === "Enter") { e.preventDefault(); send(); } });
  });

  // catch every route to the résumé, now and for any link added later
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest('a[href$="resume.pdf"], a[href="#resume"]');
    if (a) open(e);
  });
})();
