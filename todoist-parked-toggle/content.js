(function () {
  const BUTTON_ID = 'todoist-parked-toggle-btn';

  // The "Parked" board column, as a fixed DOM path from #content. Todoist's
  // board view uses generated/hashed class names, so this positional
  // selector is used instead. If Todoist changes the board layout, this
  // selector will need to be updated to match the new structure.
  const PARKED_COLUMN_SELECTOR =
    '#content > div > div > div > div > div > div > div:nth-child(4)';

  let collapsed = false;

  function findParkedColumn() {
    return document.querySelector(PARKED_COLUMN_SELECTOR);
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
      removeButton();
      return;
    }

    const column = findParkedColumn();
    if (!column) {
      removeButton();
      return;
    }

    column.style.display = collapsed ? 'none' : '';
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
