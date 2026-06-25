(function () {
  const BUTTON_ID = 'todoist-parked-toggle-btn';
  const LOG_PREFIX = '[Todoist Parked Toggle]';

  // The "Parked" board column and its divider, as fixed DOM paths from
  // #content. Todoist's board view uses generated/hashed class names, so
  // these positional selectors are used instead. If Todoist changes the
  // board layout, these selectors will need to be updated to match the new
  // structure. When a selector stops matching, this script logs a warning
  // and shows a one-time alert with the offending selector so it's easy to
  // find and fix in DevTools.
  const PARKED_COLUMN_SELECTORS = [
    '#content > div > div > div > div > div > div > div:nth-child(3)',
    '#content > div > div > div > div > div > div > div:nth-child(4)',
  ];

  let collapsed = true;
  const missingSelectors = new Set();

  function findParkedColumns() {
    const found = [];
    for (const selector of PARKED_COLUMN_SELECTORS) {
      const el = document.querySelector(selector);
      if (el) {
        found.push(el);
        missingSelectors.delete(selector);
        continue;
      }

      console.warn(`${LOG_PREFIX} selector matched no element:`, selector);
      if (!missingSelectors.has(selector)) {
        missingSelectors.add(selector);
        alert(
          `${LOG_PREFIX} Could not find the Parked column.\n\nSelector: ${selector}\n\n` +
            'Todoist\'s board layout may have changed. Open DevTools and update ' +
            'PARKED_COLUMN_SELECTORS in content.js.'
        );
      }
    }
    return found;
  }

  function isInboxView() {
    return /\/app\/inbox(\/|$|\?)/.test(location.pathname + location.search);
  }

  function ensureButton() {
    let btn = document.getElementById(BUTTON_ID);
    if (!btn) {
      btn = document.createElement('button');
      btn.id = BUTTON_ID;
      btn.type = 'button';
      btn.addEventListener('click', toggleParkedColumn);
      document.body.appendChild(btn);
    }
    btn.textContent = collapsed ? 'Show Parked' : 'Hide Parked';
    btn.classList.toggle('collapsed', collapsed);
    return btn;
  }

  function removeButton() {
    const btn = document.getElementById(BUTTON_ID);
    if (btn) btn.remove();
  }

  function toggleParkedColumn() {
    collapsed = !collapsed;
    tick();
  }

  function tick() {
    if (!isInboxView()) {
      missingSelectors.clear();
      removeButton();
      return;
    }

    const columns = findParkedColumns();
    if (columns.length === 0) {
      console.warn(`${LOG_PREFIX} no Parked columns found on this page.`);
      removeButton();
      return;
    }

    columns.forEach((column) => {
      column.style.display = collapsed ? 'none' : '';
    });
    ensureButton();
  }

  function debounce(fn, wait) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), wait);
    };
  }

  const debouncedTick = debounce(tick, 400);

  new MutationObserver(debouncedTick).observe(document.body, {
    childList: true,
    subtree: true,
  });

  // Todoist is a single-page app; detect URL changes (e.g. switching views).
  let lastUrl = location.href;
  setInterval(() => {
    if (location.href !== lastUrl) {
      lastUrl = location.href;
      debouncedTick();
    }
  }, 500);

  tick();
})();
