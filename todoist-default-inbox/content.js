(function () {
  if (location.pathname === '/app/today' || location.pathname === '/app/today/') {
    location.replace('https://app.todoist.com/app/inbox' + location.search + location.hash);
  }
})();
