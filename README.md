# Softr Onboarding Tour

Interactive onboarding tour for the StrengthFoundation Softr.io portal. Guides new users through the "Налаштування аккаунту" (Account Settings) page with spotlight highlights and tooltips.

**Vanilla JavaScript — zero dependencies.**

## Tour Flow

| Step | Title | Target |
|------|-------|--------|
| Welcome | Ласкаво просимо! | Centered modal |
| 1/7 | Версія панелі | Top navigation |
| 2/7 | Ваші картки | User cards section |
| 3/7 | Ваш особистий профіль | Profile details |
| 4/7 | Налаштування особистого профілю | Profile form |
| 5/7 | Ваше фото | Avatar upload |
| 6/7 | Головне меню | Left sidebar menu |
| 7/7 | Вивчили питання? | Main content area |
| Final | Огляд завершено! | Centered modal |

## Installation (via jsDelivr CDN)

Add to your Softr app's **Code Inside Footer** section:

```html
<!-- Onboarding Tour -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/info-strengthfoundation/onboarding-tour@main/css/onboarding-tour.css">
<script src="https://cdn.jsdelivr.net/gh/info-strengthfoundation/onboarding-tour@main/js/onboarding-tour.js"></script>
```

## How It Works

1. User arrives at the account settings page with `?from=welcome` in the URL
2. Tour checks `localStorage` for `softr-tour-completed`
3. If not completed, the tour starts automatically with a welcome modal
4. User progresses through 7 highlighted steps via "Далі" (Next) button
5. On completion, `softr-tour-completed` is saved to `localStorage`
6. Tour will not auto-start again for that user

## Controls

| Action | Trigger |
|--------|---------|
| Next step | "Далі" button, Enter, or ArrowRight key |
| Skip tour | "Пропустити" button, ESC key, or click overlay |
| Restart tour (JS) | `window._tour.reset(); window._tour.start();` |

## Customization

### CSS Variables

Override in your own stylesheet to change the look:

```css
:root {
  --tour-gold: #C9A227;           /* Primary accent color */
  --tour-gold-hover: #b08d1e;     /* Hover state */
  --tour-dark: #1C1C1C;           /* Title text color */
  --tour-overlay-bg: rgba(0,0,0,0.7);  /* Overlay darkness */
  --tour-tooltip-max-width: 380px;
}
```

### Selector Mapping

The default selectors use Softr data attributes and common class names. If your Softr page uses different selectors, update them in `tour-script.js` in the `steps` array, or use the public API:

```js
// Override step selectors at runtime
var steps = window._tour.getSteps();
steps[1].selector = '#my-custom-header';  // Step 1/7
window._tour.setSteps(steps);
```

### Public API

```js
window._tour.start()      // Start the tour manually
window._tour.next()       // Advance to next step
window._tour.skip()       // Skip and mark complete
window._tour.finish()     // Finish and mark complete
window._tour.reset()      // Clear completion flag from localStorage
window._tour.getSteps()   // Get current steps array
window._tour.setSteps([]) // Replace steps array
```

## Versioning with jsDelivr

Pin to a specific commit or tag for production stability:

```html
<!-- Pinned to a specific commit -->
<script src="https://cdn.jsdelivr.net/gh/info-strengthfoundation/onboarding-tour@COMMIT_HASH/js/onboarding-tour.js"></script>

<!-- Or use @latest for always-current -->
<script src="https://cdn.jsdelivr.net/gh/info-strengthfoundation/onboarding-tour@latest/js/onboarding-tour.js"></script>
```

To purge jsDelivr cache after an update, visit:
`https://purge.jsdelivr.net/gh/info-strengthfoundation/onboarding-tour@main/js/onboarding-tour.js`

## Browser Support

Works in all modern browsers (Chrome, Firefox, Safari, Edge). Uses `URLSearchParams`, `localStorage`, and `requestAnimationFrame`.

## License

MIT
