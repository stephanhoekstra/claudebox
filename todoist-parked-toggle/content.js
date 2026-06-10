(function () {
  const BUTTON_ID = 'todoist-parked-toggle-btn';
  const COLUMN_LABEL = 'parked';

  let collapsed = false;

  // Find the board column whose header text is "Parked" (any case).
  // Todoist's board view uses generated/hashed class names, so instead of
  // relying on those we walk up from a text node that says "Parked" until
  // we find the outermost ancestor that is still one of several sibling
  // "columns" and that contains a sizeable subtree (the column's task list).
  // Climbing as far as possible (rather than stopping at the first match)
  // ensures we toggle the whole column, not just its header.
  function findParkedColumn() {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let textNode;
    while ((textNode = walker.nextNode())) {
      if (textNode.nodeValue.trim().toLowerCase() !== COLUMN_LABEL.toLowerCase()) continue;

      let node = textNode.parentElement;
      let candidate = null;
      for (let depth = 0; node && depth < 10; depth++, node = node.parentElement) {
        const parent = node.parentElement;
        if (!parent) continue;

        const siblings = Array.from(parent.children);
        if (siblings.length < 2) continue;

        // A board column should have a non-trivial subtree (its task cards).
        if (node.querySelectorAll('*').length > 10) {
          candidate = node;
        }
      }
      if (candidate) return candidate;
    }
    return null;
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
