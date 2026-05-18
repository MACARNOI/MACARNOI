async function init() {
  await renderSidebar();
  initSidebarEvents();
  // 当归档页面渲染完成后
  if (typeof initHorizontalScroll === 'function') {
    initHorizontalScroll('.archives .box ul');
  }
  // 默认加载首页
  loadPage('home', () => window.renderHomePage(1));
}

init();