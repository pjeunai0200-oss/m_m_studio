/* BEAT & VINYL v2 — script.js */
document.addEventListener('DOMContentLoaded', () => {

  /* ============================
     TOP BAR OFFSET
     ============================ */
  const topBar   = document.querySelector('.top-bar');
  const header   = document.getElementById('header');

  const setHeaderTop = () => {
    const tbH = topBar ? topBar.offsetHeight : 0;
    header.style.top = window.scrollY < tbH ? `${tbH - window.scrollY}px` : '0px';
    header.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', setHeaderTop, { passive: true });
  setHeaderTop();


  /* ============================
     HAMBURGER
     ============================ */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('nav-links');
  hamburger?.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    hamburger.querySelectorAll('span').forEach((s, i) => {
      s.style.transform = open
        ? i === 0 ? 'rotate(45deg) translate(5px,5px)'
        : i === 2 ? 'rotate(-45deg) translate(5px,-5px)' : 'scaleX(0)'
        : '';
      s.style.opacity = (open && i === 1) ? '0' : '';
    });
  });
  document.querySelectorAll('.nav-link').forEach(l =>
    l.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger?.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    })
  );


  /* ============================
     ROOMS SLIDER
     ============================ */
  const track  = document.getElementById('rooms-track');
  const dots   = document.querySelectorAll('.dot');
  const btnPrev = document.getElementById('rooms-prev');
  const btnNext = document.getElementById('rooms-next');
  let current = 0;
  const total = 3;

  const goTo = (idx) => {
    current = (idx + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  };
  btnPrev?.addEventListener('click', () => goTo(current - 1));
  btnNext?.addEventListener('click', () => goTo(current + 1));
  dots.forEach(d => d.addEventListener('click', () => goTo(+d.dataset.idx)));

  /* Touch/swipe support */
  let touchStartX = 0;
  track?.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track?.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) goTo(current + (diff > 0 ? 1 : -1));
  });

  /* Auto-play */
  let autoTimer = setInterval(() => goTo(current + 1), 5000);
  const resetAuto = () => { clearInterval(autoTimer); autoTimer = setInterval(() => goTo(current + 1), 5000); };
  [btnPrev, btnNext].forEach(b => b?.addEventListener('click', resetAuto));


  /* ============================
     PRICE CALCULATOR
     ============================ */
  const slider      = document.getElementById('hours-slider');
  const hoursBadge  = document.getElementById('hours-badge');
  const totalNumEl  = document.getElementById('total-num');
  const modalPrice  = document.getElementById('modal-price');
  const rlRoomName  = document.getElementById('rl-room-name');
  const rlRoomPrice = document.getElementById('rl-room-price');
  const rlStick     = document.getElementById('rl-stick');
  const rlDrink     = document.getElementById('rl-drink');
  const addonStick  = document.getElementById('addon-stick');
  const addonDrink  = document.getElementById('addon-drink');
  const receiptDate = document.getElementById('receipt-date');

  /* Date stamp */
  if (receiptDate) {
    const d = new Date();
    receiptDate.textContent = `${d.getFullYear()}.${String(d.getMonth()+1).padStart(2,'0')}.${String(d.getDate()).padStart(2,'0')}`;
  }

  const fmt = n => n.toLocaleString('ko-KR') + '원';

  let rafId;
  const animateNum = (el, target) => {
    cancelAnimationFrame(rafId);
    const start = parseInt(el.textContent.replace(/[^0-9]/g, '')) || 0;
    const startTime = performance.now();
    const dur = 350;
    el.classList.add('bump');
    setTimeout(() => el.classList.remove('bump'), 300);
    const run = (now) => {
      const p = Math.min((now - startTime) / dur, 1);
      const ease = 1 - (1 - p) ** 3;
      el.textContent = fmt(Math.round(start + (target - start) * ease));
      if (p < 1) rafId = requestAnimationFrame(run);
    };
    rafId = requestAnimationFrame(run);
  };

  const updateSlider = () => {
    const pct = ((slider.value - 1) / 9) * 100;
    slider.style.background = `linear-gradient(to right, #FACC15 ${pct}%, #2e2e2e ${pct}%)`;
  };

  const calcTotal = () => {
    const roomPrice = parseInt(document.querySelector('input[name="room"]:checked')?.value || 15000);
    const hours     = parseInt(slider.value);
    const stick     = addonStick.checked ? 2000 : 0;
    const drink     = addonDrink.checked ? 3000 : 0;
    const total     = roomPrice * hours + stick + drink;
    const rName     = roomPrice === 15000 ? '드럼 작업실' : '개인 연습실';

    hoursBadge.textContent = `${hours}시간`;
    rlRoomName.textContent  = `${rName} × ${hours}시간`;
    rlRoomPrice.textContent = fmt(roomPrice * hours);
    rlStick.classList.toggle('hidden', !addonStick.checked);
    rlDrink.classList.toggle('hidden', !addonDrink.checked);

    animateNum(totalNumEl, total);
    if (modalPrice) modalPrice.textContent = fmt(total);
    updateSlider();
    return total;
  };

  slider?.addEventListener('input', calcTotal);
  document.querySelectorAll('input[name="room"]').forEach(r => r.addEventListener('change', calcTotal));
  addonStick?.addEventListener('change', calcTotal);
  addonDrink?.addEventListener('change', calcTotal);
  calcTotal();


  /* ============================
     RESERVE MODAL
     ============================ */
  const overlay    = document.getElementById('modal-overlay');
  const reserveBtn = document.getElementById('reserve-btn');
  const modalClose = document.getElementById('modal-close');
  const modalOk    = document.getElementById('modal-ok');

  const openModal  = () => { calcTotal(); overlay.classList.add('active'); document.body.style.overflow = 'hidden'; };
  const closeModal = () => { overlay.classList.remove('active'); document.body.style.overflow = ''; };

  reserveBtn?.addEventListener('click', openModal);
  modalClose?.addEventListener('click', closeModal);
  modalOk?.addEventListener('click', closeModal);
  overlay?.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });


  /* ============================
     LP PLAY TOGGLE
     ============================ */
  let currentPlaying = null;

  const stopCard = (card) => {
    if (!card) return;
    card.classList.remove('playing');
    card.querySelector('.i-play').style.display = '';
    card.querySelector('.i-pause').style.display = 'none';
  };
  const startCard = (card) => {
    card.classList.add('playing');
    card.querySelector('.i-play').style.display = 'none';
    card.querySelector('.i-pause').style.display = '';
  };

  document.querySelectorAll('.lp-play-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const card = btn.closest('.lp-card');
      if (currentPlaying === card) {
        stopCard(card);
        currentPlaying = null;
      } else {
        stopCard(currentPlaying);
        startCard(card);
        currentPlaying = card;
      }
    });
  });
  /* click cover also toggles */
  document.querySelectorAll('.lp-cover-wrap').forEach(wrap => {
    wrap.addEventListener('click', () => {
      wrap.querySelector('.lp-play-btn').click();
    });
  });


  /* ============================
     CONTACT FORM
     ============================ */
  const form   = document.getElementById('contact-form');
  const submit = document.getElementById('contact-submit-btn');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name  = document.getElementById('f-name').value.trim();
    const phone = document.getElementById('f-phone').value.trim();
    if (!name || !phone) {
      submit.style.background = '#cc2222';
      submit.textContent = '이름과 연락처를 입력해주세요';
      setTimeout(() => { submit.style.background = ''; submit.textContent = '문의 보내기'; }, 2500);
      return;
    }
    submit.style.background = '#16a34a';
    submit.style.color = '#fff';
    submit.textContent = '✓  접수 완료!';
    setTimeout(() => {
      form.reset();
      submit.style.background = '';
      submit.style.color = '';
      submit.textContent = '문의 보내기';
    }, 3000);
  });


  /* ============================
     SCROLL REVEAL
     ============================ */
  const revealTargets = document.querySelectorAll(
    '.room-slide-info, .split-text-side, .calc-receipt, .calc-panel, .lp-card, .cinfo-item, .contact-form, .sstat'
  );
  revealTargets.forEach(el => el.classList.add('reveal'));
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 70);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealTargets.forEach(el => io.observe(el));

});
