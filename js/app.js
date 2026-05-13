// app.js
async function init() {
  await renderSidebar();          // 先渲染侧边栏
  initSidebarEvents();            // 再绑定菜单事件
  // 默认加载首页
  // loadPage('home', renderHomePage);
}

init();