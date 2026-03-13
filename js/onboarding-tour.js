/* ==========================================================================
   Onboarding Tour — JavaScript Module
   ========================================================================== */
(function () {
  'use strict';

  /* ---------- Step Configuration (populate later) ---------- */
  var steps = [
    // { selector: 'CSS_SELECTOR', title: 'STEP_TITLE', text: 'STEP_DESCRIPTION' }
  ];

  /* ---------- State ---------- */
  var currentStep = -1;
  var els = {}; // cached DOM references
  var active = false;

  /* ---------- Helpers ---------- */

  function qs(selector) {
    return document.querySelector(selector);
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
    els.text = createElement('p', 'tour-tooltip__text');

    var footer = createElement('div', 'tour-tooltip__footer');
    els.progress = createElement('span', 'tour-tooltip__progress');

    var actions = createElement('div', 'tour-tooltip__actions');
    els.skipBtn = createElement('button', 'tour-btn tour-btn--secondary');
    els.skipBtn.textContent = 'Skip';
    els.skipBtn.setAttribute('type', 'button');
    els.skipBtn.setAttribute('aria-label', 'Skip tour');

    els.nextBtn = createElement('button', 'tour-btn tour-btn--primary');
    els.nextBtn.setAttribute('type', 'button');

    actions.appendChild(els.skipBtn);
    actions.appendChild(els.nextBtn);
    footer.appendChild(els.progress);
    footer.appendChild(actions);

    els.tooltip.appendChild(els.arrow);
    els.tooltip.appendChild(els.title);
    els.tooltip.appendChild(els.text);
    els.tooltip.appendChild(footer);

    document.body.appendChild(els.overlay);
    document.body.appendChild(els.spotlight);
    document.body.appendChild(els.tooltip);

    // Event listeners
    els.nextBtn.addEventListener('click', next);
    els.skipBtn.addEventListener('click', finish);
    els.overlay.addEventListener('click', finish);
    document.addEventListener('keydown', onKeyDown);
  }

  /* ---------- Positioning Engine ---------- */

  function positionTooltip(step) {
    var GAP = 12;

    // Modal-only step (no selector)
    if (!step.selector) {
      els.spotlight.style.display = 'none';
      els.tooltip.className = 'tour-tooltip tour-tooltip--center';
      els.arrow.style.display = 'none';
      requestAnimationFrame(function () {
        els.tooltip.classList.add('tour-tooltip--visible');
      });
      return;
    }

    var target = qs(step.selector);
    if (!target) {
      // Target not found — fall back to centered modal
      els.spotlight.style.display = 'none';
      els.tooltip.className = 'tour-tooltip tour-tooltip--center';
      els.arrow.style.display = 'none';
      requestAnimationFrame(function () {
        els.tooltip.classList.add('tour-tooltip--visible');
      });
      return;
    }

    // Scroll target into view if needed
    target.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Wait a tick for scroll to settle, then measure
    requestAnimationFrame(function () {
      var rect = target.getBoundingClientRect();
      var pad = 8; // spotlight padding around element

      // Position spotlight
      els.spotlight.style.display = '';
      els.spotlight.style.top = (rect.top - pad) + 'px';
      els.spotlight.style.left = (rect.left - pad) + 'px';
      els.spotlight.style.width = (rect.width + pad * 2) + 'px';
      els.spotlight.style.height = (rect.height + pad * 2) + 'px';

      // Determine best placement
      var placement = computePlacement(rect);
      els.tooltip.className = 'tour-tooltip tour-tooltip--' + placement;
      els.arrow.style.display = '';

      var tooltipRect = els.tooltip.getBoundingClientRect();
      var pos = calcTooltipPosition(placement, rect, tooltipRect, GAP);

      els.tooltip.style.top = pos.top + 'px';
      els.tooltip.style.left = pos.left + 'px';

      requestAnimationFrame(function () {
        els.tooltip.classList.add('tour-tooltip--visible');
      });
    });
  }

  function computePlacement(targetRect) {
    var vw = window.innerWidth;
    var vh = window.innerHeight;
    var spaceBelow = vh - targetRect.bottom;
    var spaceAbove = targetRect.top;
    var spaceRight = vw - targetRect.right;
    var spaceLeft = targetRect.left;

    // Prefer below, then above, then right, then left
    if (spaceBelow >= 180) return 'bottom';
    if (spaceAbove >= 180) return 'top';
    if (spaceRight >= 320) return 'right';
    if (spaceLeft >= 320) return 'left';
    return 'bottom'; // default
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

    // Clamp horizontal position within viewport
    if (left < 8) left = 8;
    if (left + tooltipRect.width > vw - 8) left = vw - tooltipRect.width - 8;

    // Clamp vertical position
    if (top < 8) top = 8;

    return { top: top, left: left };
  }

  /* ---------- Step Rendering ---------- */

  function showStep(index) {
    if (index < 0 || index >= steps.length) return;

    currentStep = index;
    var step = steps[currentStep];

    // Reset visibility for transition
    els.tooltip.classList.remove('tour-tooltip--visible');

    // Update content
    els.title.textContent = step.title || '';
    els.text.textContent = step.text || '';

    var isLast = currentStep === steps.length - 1;
    els.nextBtn.textContent = isLast ? 'Finish' : 'Next';
    els.nextBtn.setAttribute('aria-label', isLast ? 'Finish tour' : 'Next step');
    els.progress.textContent = (currentStep + 1) + ' of ' + steps.length;

    positionTooltip(step);
  }

  /* ---------- Navigation ---------- */

  function next() {
    if (currentStep >= steps.length - 1) {
      finish();
      return;
    }
    showStep(currentStep + 1);
  }

  function finish() {
    teardown();
  }

  function onKeyDown(e) {
    if (!active) return;
    if (e.key === 'Escape') finish();
    if (e.key === 'ArrowRight' || e.key === 'Enter') next();
  }

  /* ---------- Lifecycle ---------- */

  function start() {
    if (active) return;
    if (steps.length === 0) return;

    active = true;
    buildUI();

    // Show overlay first, then first step
    requestAnimationFrame(function () {
      els.overlay.classList.add('tour-overlay--visible');
      showStep(0);
    });
  }

  function teardown() {
    active = false;
    currentStep = -1;
    document.removeEventListener('keydown', onKeyDown);

    // Fade out
    if (els.overlay) els.overlay.classList.remove('tour-overlay--visible');
    if (els.tooltip) els.tooltip.classList.remove('tour-tooltip--visible');

    // Remove DOM after transition
    setTimeout(function () {
      if (els.overlay && els.overlay.parentNode) els.overlay.parentNode.removeChild(els.overlay);
      if (els.spotlight && els.spotlight.parentNode) els.spotlight.parentNode.removeChild(els.spotlight);
      if (els.tooltip && els.tooltip.parentNode) els.tooltip.parentNode.removeChild(els.tooltip);
      els = {};
    }, 300);
  }

  /* ---------- URL Parameter Detection ---------- */

  function shouldAutoStart() {
    var params = new URLSearchParams(window.location.search);
    return params.get('from') === 'welcome';
  }

  /* ---------- Public API ---------- */

  window._tour = {
    start: start,
    next: next,
    finish: finish,
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
