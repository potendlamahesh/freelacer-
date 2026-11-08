/* Portfolio scripts */

/* Navbar: scrolled state and mobile menu */
(function () {
  var nav = document.getElementById('nav');
  var hamburger = document.getElementById('hamburger');
  var navLinks = document.getElementById('nav-links');
  if (!nav) return;

  function onScroll() { nav.classList.toggle('scrolled', window.scrollY > 40); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (!hamburger || !navLinks) return;
  function setOpen(open) {
    navLinks.classList.toggle('open', open);
    hamburger.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
  }
  hamburger.addEventListener('click', function () {
    setOpen(!navLinks.classList.contains('open'));
  });
  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () { setOpen(false); });
  });
})();

/* Highlight the nav link of the section in view */
(function () {
  var sections = document.querySelectorAll('section[id]');
  var links = document.querySelectorAll('.nav-links a[href^="#"]');
  if (!sections.length || !links.length || !('IntersectionObserver' in window)) return;

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var id = '#' + entry.target.id;
      links.forEach(function (l) {
        l.classList.toggle('active', l.getAttribute('href') === id);
      });
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(function (s) { io.observe(s); });
})();

/* Fade content in as it scrolls into view */
(function () {
  var items = document.querySelectorAll('.reveal');
  if (!items.length) return;
  if (!('IntersectionObserver' in window)) {
    items.forEach(function (el) { el.classList.add('visible'); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      io.unobserve(entry.target);
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
  items.forEach(function (el) { io.observe(el); });
})();

/* Back to top */
(function () {
  var btn = document.getElementById('back-to-top');
  if (!btn) return;
  function update() { btn.hidden = window.scrollY <= 500; }
  window.addEventListener('scroll', update, { passive: true });
  update();
  btn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* Contact form: validate, then open the visitor's email app with the message filled in */
(function () {
  var TO = 'dev@maheshp.in';
  var form = document.getElementById('contact-form');
  var status = document.getElementById('form-status');
  if (!form) return;

  function check(id, errId, test, msg) {
    var el = document.getElementById(id);
    var err = document.getElementById(errId);
    var ok = test(el.value.trim());
    el.classList.toggle('invalid', !ok);
    err.textContent = ok ? '' : msg;
    return ok;
  }
  function isEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var results = [
      check('f-name', 'err-name', function (v) { return v.length >= 2; }, 'Please enter your name.'),
      check('f-email', 'err-email', isEmail, 'Please enter a valid email address.'),
      check('f-type', 'err-type', function (v) { return v !== ''; }, 'Please choose a topic.'),
      check('f-message', 'err-message', function (v) { return v.length >= 20; }, 'Please write at least 20 characters.')
    ];
    if (results.indexOf(false) !== -1) return;

    var name = document.getElementById('f-name').value.trim();
    var email = document.getElementById('f-email').value.trim();
    var type = document.getElementById('f-type').value;
    var message = document.getElementById('f-message').value.trim();

    var subject = type + ': message from ' + name;
    var body = 'Name: ' + name + '\r\nEmail: ' + email + '\r\nTopic: ' + type + '\r\n\r\n' + message;
    window.location.href = 'mailto:' + TO + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);

    status.textContent = 'Your email app should open with the message ready to send. If nothing opens, write to ' + TO + ' directly.';
    status.hidden = false;
  });

  ['f-name', 'f-email', 'f-type', 'f-message'].forEach(function (id) {
    var el = document.getElementById(id);
    el.addEventListener('input', function () { el.classList.remove('invalid'); });
    el.addEventListener('change', function () { el.classList.remove('invalid'); });
  });
})();
