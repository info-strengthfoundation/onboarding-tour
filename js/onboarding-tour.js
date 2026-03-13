/* ==========================================================================
   Onboarding Tour — JavaScript Module
   Softr.io Portal — StrengthFoundation
   Vanilla JS, no dependencies
   ========================================================================== */
(function () {
  'use strict';

  /* ---------- Configuration ---------- */
  var STORAGE_KEY = 'softr-tour-completed';
  var POLICIES_URL = '/strategies-and-policies';

  /* ---------- Step Definitions ---------- */
  var steps = [
    // Step 0: Welcome Introduction (centered modal, no spotlight)
    {
      type: 'welcome',
      title: 'Ласкаво просимо!',
      text: 'Зараз ми перейдемо до ближчого знайомства з ресурсом, у якому Ви знаходитесь — порталом фонду. Це наш спільний робочий простір: тут зібрані важливі документи, правила взаємодії, структура роботи та матеріали, які допоможуть швидко зорієнтуватися і комфортно включитися в процеси.',
      selector: null,
      position: 'center',
      button: 'Почати огляд'
    },
    // Step 1/6: Верхня панель
    {
      step: '1/6',
      title: '1/6 Верхня панель',
      text: 'Швидкий доступ до скарг, пропозицій, анкетування та профілю.',
      selector: '.softr-topbar',
      position: 'bottom',
      button: 'Далі'
    },
    // Step 2/6: Ваш профіль
    {
      step: '2/6',
      title: '2/6 Ваш профіль',
      text: 'Тут можна відрити налаштування профілю, перейти на сайт фонду, продивитись завдання, події та ознайомитись з підказками щодо інформаційної безпеки.',
      selector: '.softr-nav-profile-button',
      position: 'bottom',
      button: 'Далі'
    },
    // Step 3/6: Ваш особистий профіль (merged old 3+4)
    {
      step: '3/6',
      title: '3/6 Ваш особистий профіль',
      text: 'Тут зібрана вся основна інформація про Вас як волонтера фонду. Будь ласка, перевірте свою особисту інформацію в профілі та додайте дані, яких не вистачає. Якщо якась інформація змінилася — також оновіть її. Це важливо для коректної співпраці.',
      selector: 'main',
      position: 'right',
      button: 'Далі'
    },
    // Step 4/6: Ваше фото
    {
      step: '4/6',
      title: '4/6 Ваше фото',
      text: 'Будь ласка, завантажте Ваше фото. Це допоможе колегам швидше ідентифікувати Вас у команді.',
      selector: '.avatar-container',
      position: 'bottom',
      button: 'Далі'
    },
    // Step 5/6: Головне меню
    {
      step: '5/6',
      title: '5/6 Головне меню',
      html: true,
      text: 'Зліва на порталі розташовані основні розділи:<ul>' +
        '<li><strong>Портал фонду</strong> — головна сторінка порталу, де відображається основна інформація.</li>' +
        '<li><strong>Завдання</strong> — тут ви можете переглянути свої особисті завдання, а також задачі, які поставлені для вашого відділу.</li>' +
        '<li><strong>Структура фонду</strong> — у цьому розділі можна ознайомитися зі структурою фонду: відділами, керівниками та розподілом команд.</li>' +
        '<li><strong>Проєкти</strong> — інформація про всі проєкти фонду: їх цілі, напрямки роботи та поточні ініціативи.</li>' +
        '<li><strong>Політики та стратегії</strong> — обов\'язковий розділ для ознайомлення. Після перегляду необхідно підтвердити ознайомлення, натиснувши відповідну кнопку.</li>' +
        '<li><strong>FAQ</strong> — розділ з відповідями на найбільш поширені запитання, де можна швидко знайти необхідну інформацію.</li>' +
        '</ul>',
      selector: '.softr-sidebar',
      position: 'right',
      button: 'Далі'
    },
    // Step 6/6: Виникли питання?
    {
      step: '6/6',
      title: '6/6 Виникли питання?',
      text: 'Після перегляду необхідно підтвердити ознайомлення, натиснувши відповідну кнопку.',
      selector: null,
      position: 'center',
      button: 'Далі'
    },
    // Final Step: Огляд завершено!
    {
      type: 'final',
      title: 'Огляд завершено!',
      html: true,
      text: 'Тепер Ви готові до роботи з порталом.<br><br>' +
        'Будь ласка, перейдіть до обов\'язкового розділу «Політики та стратегії» для ознайомлення з внутрішніми правилами фонду.',
      selector: null,
      position: 'center',
      button: 'Політики та стратегії'
    }
  ];

  /* ---------- State ---------- */
  var currentStep = -1;
  var els = {};
  var active = false;

  /* ---------- Helpers ---------- */

  /** Try multiple comma-separated selectors and return the first match */
  function queryFirst(selectorString) {
    if (!selectorString) return null;
    var selectors = selectorString.split(',');
    for (var i = 0; i < selectors.length; i++) {
      try {
        var el = document.querySelector(selectors[i].trim());
        if (el) return el;
      } catch (e) {
        // Invalid selector — skip
      }
    }
    return null;
  }

  function createElement(tag, className) {
    var el = document.createElement(tag);
    if (className) el.className = className;
    return el;
  }

  /* ---------- DOM Creation ---------- */

  function buildUI() {
    // Overlay
    els.overlay = createElement('div', 'tour-overlay');
    els.overlay.setAttribute('aria-hidden', 'true');

    // Spotlight
    els.spotlight = createElement('div', 'tour-spotlight');
    els.spotlight.setAttribute('aria-hidden', 'true');

    // Tooltip
    els.tooltip = createElement('div', 'tour-tooltip');
    els.tooltip.setAttribute('role', 'dialog');
    els.tooltip.setAttribute('aria-modal', 'true');
    els.tooltip.setAttribute('aria-label', 'Onboarding tour');

    els.arrow = createElement('div', 'tour-tooltip__arrow');
    els.title = createElement('h2', 'tour-tooltip__title');
    els.text = createElement('div', 'tour-tooltip__text');

    var footer = createElement('div', 'tour-tooltip__footer');
    els.progress = createElement('span', 'tour-tooltip__progress');

    els.actions = createElement('div', 'tour-tooltip__actions');
    els.skipBtn = createElement('button', 'tour-btn tour-btn--secondary');
    els.skipBtn.textContent = 'Пропустити';
    els.skipBtn.setAttribute('type', 'button');
    els.skipBtn.setAttribute('aria-label', 'Пропустити тур');

    els.nextBtn = createElement('button', 'tour-btn tour-btn--primary');
    els.nextBtn.setAttribute('type', 'button');

    els.actions.appendChild(els.skipBtn);
    els.actions.appendChild(els.nextBtn);
    footer.appendChild(els.progress);
    footer.appendChild(els.actions);

    els.tooltip.appendChild(els.arrow);
    els.tooltip.appendChild(els.title);
    els.tooltip.appendChild(els.text);
    els.tooltip.appendChild(footer);

    document.body.appendChild(els.overlay);
    document.body.appendChild(els.spotlight);
    document.body.appendChild(els.tooltip);

    // Event listeners
    els.nextBtn.addEventListener('click', next);
    els.skipBtn.addEventListener('click', skip);
    els.overlay.addEventListener('click', skip);
    document.addEventListener('keydown', onKeyDown);
  }

  /* ---------- Positioning Engine ---------- */

  function positionTooltip(step) {
    var GAP = 12;

    // Centered modal (no spotlight)
    if (!step.selector) {
      els.spotlight.style.display = 'none';
      els.tooltip.className = 'tour-tooltip tour-tooltip--center';
      els.arrow.style.display = 'none';
      requestAnimationFrame(function () {
        els.tooltip.classList.add('tour-tooltip--visible');
      });
      return;
    }

    var target = queryFirst(step.selector);
    if (!target) {
      console.warn('[Tour] Target element not found for step: ' + (step.title || ''), 'Selectors:', step.selector);
      // Fallback to centered modal
      els.spotlight.style.display = 'none';
      els.tooltip.className = 'tour-tooltip tour-tooltip--center';
      els.arrow.style.display = 'none';
      requestAnimationFrame(function () {
        els.tooltip.classList.add('tour-tooltip--visible');
      });
      return;
    }

    // Scroll target into view if needed
    target.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    // Wait for scroll to settle before measuring positions
    setTimeout(function () {
      var rect = target.getBoundingClientRect();
      var pad = 8;
      var vw = window.innerWidth;
      var vh = window.innerHeight;

      // Clamp spotlight to visible viewport
      var spotTop = Math.max(0, rect.top - pad);
      var spotLeft = Math.max(0, rect.left - pad);
      var spotBottom = Math.min(vh, rect.bottom + pad);
      var spotRight = Math.min(vw, rect.right + pad);

      // Position spotlight (viewport-clamped)
      els.spotlight.style.display = '';
      els.spotlight.style.top = spotTop + 'px';
      els.spotlight.style.left = spotLeft + 'px';
      els.spotlight.style.width = (spotRight - spotLeft) + 'px';
      els.spotlight.style.height = (spotBottom - spotTop) + 'px';

      // Use clamped rect for tooltip positioning
      var clampedRect = {
        top: spotTop, left: spotLeft,
        bottom: spotBottom, right: spotRight,
        width: spotRight - spotLeft, height: spotBottom - spotTop
      };

      // Determine placement (use step.position hint or auto-detect)
      var placement = step.position || computePlacement(clampedRect);
      if (placement === 'center') {
        els.spotlight.style.display = 'none';
        els.tooltip.className = 'tour-tooltip tour-tooltip--center';
        els.arrow.style.display = 'none';
        requestAnimationFrame(function () {
          els.tooltip.classList.add('tour-tooltip--visible');
        });
        return;
      }

      els.tooltip.className = 'tour-tooltip tour-tooltip--' + placement;
      els.arrow.style.display = '';

      var tooltipRect = els.tooltip.getBoundingClientRect();
      var pos = calcTooltipPosition(placement, clampedRect, tooltipRect, GAP);

      els.tooltip.style.top = pos.top + 'px';
      els.tooltip.style.left = pos.left + 'px';

      requestAnimationFrame(function () {
        els.tooltip.classList.add('tour-tooltip--visible');
      });
    }, 400);
  }

  function computePlacement(targetRect) {
    var vw = window.innerWidth;
    var vh = window.innerHeight;
    var spaceBelow = vh - targetRect.bottom;
    var spaceAbove = targetRect.top;
    var spaceRight = vw - targetRect.right;
    var spaceLeft = targetRect.left;

    if (spaceBelow >= 180) return 'bottom';
    if (spaceAbove >= 180) return 'top';
    if (spaceRight >= 320) return 'right';
    if (spaceLeft >= 320) return 'left';
    return 'bottom';
  }

  function calcTooltipPosition(placement, targetRect, tooltipRect, gap) {
    var top = 0;
    var left = 0;
    var vw = window.innerWidth;

    switch (placement) {
      case 'bottom':
        top = targetRect.bottom + gap;
        left = targetRect.left + targetRect.width / 2 - tooltipRect.width / 2;
        break;
      case 'top':
        top = targetRect.top - tooltipRect.height - gap;
        left = targetRect.left + targetRect.width / 2 - tooltipRect.width / 2;
        break;
      case 'right':
        top = targetRect.top + targetRect.height / 2 - tooltipRect.height / 2;
        left = targetRect.right + gap;
        break;
      case 'left':
        top = targetRect.top + targetRect.height / 2 - tooltipRect.height / 2;
        left = targetRect.left - tooltipRect.width - gap;
        break;
    }

    // Clamp horizontal
    if (left < 8) left = 8;
    if (left + tooltipRect.width > vw - 8) left = vw - tooltipRect.width - 8;

    // Clamp vertical
    var vh = window.innerHeight;
    if (top < 8) top = 8;
    if (top + tooltipRect.height > vh - 8) top = vh - tooltipRect.height - 8;

    return { top: top, left: left };
  }

  /* ---------- Step Rendering ---------- */

  function showStep(index) {
    if (index < 0 || index >= steps.length) return;

    currentStep = index;
    var step = steps[currentStep];
    var isWelcome = step.type === 'welcome';
    var isFinal = step.type === 'final';

    // Reset visibility
    els.tooltip.classList.remove('tour-tooltip--visible');

    // Update content
    els.title.textContent = step.title || '';

    if (step.html) {
      els.text.innerHTML = step.text || '';
    } else {
      els.text.textContent = step.text || '';
    }

    // Configure buttons and progress based on step type
    if (isWelcome) {
      // Welcome: only "Почати огляд" button, no skip, no progress
      els.skipBtn.style.display = 'none';
      els.progress.textContent = '';
      els.nextBtn.textContent = step.button;
      els.nextBtn.setAttribute('aria-label', 'Почати огляд');
      // Remove policies button if present
      removePoliciesButton();
    } else if (isFinal) {
      // Final: main button navigates to Політики та стратегії
      els.skipBtn.style.display = 'none';
      els.progress.textContent = '';
      els.nextBtn.textContent = step.button;
      els.nextBtn.setAttribute('aria-label', 'Перейти до політик та стратегій');
      removePoliciesButton();
    } else {
      // Regular step: "Далі" + "Пропустити" buttons + progress
      els.skipBtn.style.display = '';
      els.nextBtn.textContent = step.button || 'Далі';
      els.nextBtn.setAttribute('aria-label', 'Наступний крок');
      els.progress.textContent = step.step || '';
      removePoliciesButton();
    }

    positionTooltip(step);
  }

  function addPoliciesButton() {
    if (els.policiesBtn) return;
    els.policiesBtn = createElement('button', 'tour-btn tour-btn--link');
    els.policiesBtn.textContent = 'Політики та стратегії';
    els.policiesBtn.setAttribute('type', 'button');
    els.policiesBtn.setAttribute('aria-label', 'Перейти до політик та стратегій');
    els.policiesBtn.addEventListener('click', function () {
      markCompleted();
      window.location.href = POLICIES_URL;
    });
    // Insert before the next/finish button
    els.actions.insertBefore(els.policiesBtn, els.nextBtn);
  }

  function removePoliciesButton() {
    if (els.policiesBtn && els.policiesBtn.parentNode) {
      els.policiesBtn.parentNode.removeChild(els.policiesBtn);
      els.policiesBtn = null;
    }
  }

  /* ---------- Navigation ---------- */

  function next() {
    if (currentStep >= steps.length - 1) {
      finish();
      return;
    }

    var nextIndex = currentStep + 1;
    var nextStep = steps[nextIndex];

    // Skip steps whose target element is not found (except modal steps)
    if (nextStep.selector && !queryFirst(nextStep.selector)) {
      console.warn('[Tour] Skipping step (element not found): ' + (nextStep.title || ''));
      currentStep = nextIndex;
      next();
      return;
    }

    showStep(nextIndex);
  }

  function skip() {
    markCompleted();
    teardown();
  }

  function finish() {
    markCompleted();
    teardown();
    // Navigate to Політики та стратегії after tour completion
    window.location.href = POLICIES_URL;
  }

  function markCompleted() {
    try {
      localStorage.setItem(STORAGE_KEY, 'true');
    } catch (e) {
      // localStorage unavailable
    }
  }

  function onKeyDown(e) {
    if (!active) return;
    if (e.key === 'Escape') skip();
    if (e.key === 'ArrowRight' || e.key === 'Enter') next();
  }

  /* ---------- Lifecycle ---------- */

  function start() {
    if (active) return;
    if (steps.length === 0) return;

    active = true;
    document.body.classList.add('tour-active');
    buildUI();

    requestAnimationFrame(function () {
      els.overlay.classList.add('tour-overlay--visible');
      showStep(0);
    });
  }

  function teardown() {
    active = false;
    currentStep = -1;
    document.body.classList.remove('tour-active');
    document.removeEventListener('keydown', onKeyDown);

    if (els.overlay) els.overlay.classList.remove('tour-overlay--visible');
    if (els.tooltip) els.tooltip.classList.remove('tour-tooltip--visible');

    setTimeout(function () {
      if (els.overlay && els.overlay.parentNode) els.overlay.parentNode.removeChild(els.overlay);
      if (els.spotlight && els.spotlight.parentNode) els.spotlight.parentNode.removeChild(els.spotlight);
      if (els.tooltip && els.tooltip.parentNode) els.tooltip.parentNode.removeChild(els.tooltip);
      els = {};
    }, 350);
  }

  /* ---------- Auto-start Conditions ---------- */

  function shouldAutoStart() {
    // Condition 1: URL has ?from=welcome
    var params = new URLSearchParams(window.location.search);
    if (params.get('from') !== 'welcome') return false;

    // Always start when ?from=welcome is present
    return true;
  }

  /* ---------- Public API ---------- */

  window._tour = {
    start: start,
    next: next,
    finish: finish,
    skip: skip,
    reset: function () {
      try { localStorage.removeItem(STORAGE_KEY); } catch (e) { /* noop */ }
    },
    setSteps: function (newSteps) {
      if (Array.isArray(newSteps)) steps = newSteps;
    },
    getSteps: function () {
      return steps.slice();
    }
  };

  /* ---------- Auto-start ---------- */

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      if (shouldAutoStart()) start();
    });
  } else {
    if (shouldAutoStart()) start();
  }
})();
