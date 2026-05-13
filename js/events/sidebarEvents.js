// events/sidebarEvents.js

/**
 * 初始化侧边栏菜单点击事件
 */
function initSidebarEvents() {
  // 使用事件委托，监听 .main-menu 下的所有 <a> 点击
  document.querySelector('.sidebar')?.addEventListener('click', function (e) {
    const link = e.target.closest('.main-menu a');
    if (!link) return; // 不是菜单链接，忽略

    e.preventDefault(); // 阻止 # 跳转

    const page = link.getAttribute('data-page');
    if (!page) return;

    // 1. 更新菜单的 active 状态
    const allLinks = document.querySelectorAll('.main-menu a');
    allLinks.forEach(a => a.classList.remove('active'));
    link.classList.add('active');

    // 2. 根据 page 执行对应操作
    switch (page) {
      case 'home':
        loadPage(page, renderHomePage); // 假设有 renderHomePage 函数
        break;
      case 'about':
        loadPage(page, renderAboutPage);
        break;
      case 'archives':
        loadPage(page, renderArchivesPage);
        break;
      case 'search':
        loadPage(page, renderSearchPage);
        break;
      case 'friends':
        loadPage(page, renderFriendsPage);
        break;
      case 'darkmode':
        toggleDarkMode();
        break;
      default:
        console.warn('未知页面:', page);
    }
  });
}

/**
 * 通用页面加载：先清空 #dynamic-content，再执行渲染回调
 * @param {string} pageName - 页面标识（用于调试）
 * @param {Function} renderFn - 渲染该页面的函数（负责生成 HTML 并插入）
 */
function loadPage(pageName, renderFn) {
  const container = document.getElementById('dynamic-content');
  if (!container) {
    console.error('找不到 #dynamic-content 容器');
    return;
  }

  // 清空现有内容
  container.innerHTML = '';

  // 调用对应的渲染函数
  if (typeof renderFn === 'function') {
    renderFn();
  } else {
    container.innerHTML = `<p>正在开发中：${pageName}</p>`;
  }
}

/**
 * 暗色模式切换（示例，需根据实际 CSS 变量调整）
 */
function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
  // 可以在这里存储用户偏好到 localStorage
  const isDark = document.body.classList.contains('dark-mode');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

// 以下为空函数占位，后续可替换为真实渲染模块
// function renderHomePage() {
//   // 例如调用 renderBlogCards() 渲染文章列表
//   // renderBlogCards();
//   const container = document.getElementById('dynamic-content');
//   container.innerHTML = '<p>🏠 主页内容加载中...</p>';
// }

// function renderAboutPage() {
//   const container = document.getElementById('dynamic-content');
//   container.innerHTML = '<p>👤 关于页面加载中...</p>';
// }

function renderArchivesPage() {
  const container = document.getElementById('dynamic-content');
  container.innerHTML = '<p>📁 归档页面加载中...</p>';
}

function renderSearchPage() {
  const container = document.getElementById('dynamic-content');
  container.innerHTML = '<p>🔍 搜索页面加载中...</p>';
}

function renderFriendsPage() {
  const container = document.getElementById('dynamic-content');
  container.innerHTML = '<p>🔗 友链页面加载中...</p>';
}