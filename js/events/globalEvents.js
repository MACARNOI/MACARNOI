// js/events/globalEvents.js
document.addEventListener('click', function (e) {
  // 处理通用跳转链接
  const link = e.target.closest('a[data-page]');
  if (link) {
    e.preventDefault();
    const page = link.getAttribute('data-page');
    const category = link.getAttribute('data-category');
    const postPath = link.getAttribute('data-post');
    const year = link.getAttribute('data-year');

    // 清除侧边栏激活状态（如果点击不在主菜单内）
    if (!link.closest('.main-menu')) {
      document.querySelectorAll('.main-menu a').forEach(a => a.classList.remove('active'));
    }

    if (page === 'blog' && postPath && typeof renderBlogPage === 'function') {
      renderBlogPage(postPath);
    }
    else if (page === 'category' && category && typeof renderCategoryPage === 'function') {
      renderCategoryPage(category);
    }
    else if (page === 'archives' && year && typeof renderArchivesPage === 'function') {
      renderArchivesPage(year);
    }
    else if (page === 'archives' && !year && typeof renderArchivesPage === 'function') {
      renderArchivesPage();
    }
    else if (page === 'home' && typeof renderHomePage === 'function') {
      renderHomePage(1);
    }
    return;
  }

  // 处理搜索按钮点击（侧边栏或搜索页内的搜索按钮）
  const searchBtn = e.target.closest('.search .svg a, #search-btn');
  if (searchBtn) {
    e.preventDefault();
    const searchContainer = searchBtn.closest('.search');
    const input = searchContainer ? searchContainer.querySelector('input') : document.getElementById('search-input');
    if (input && input.value.trim()) {
      renderSearchPage(input.value.trim());
    }
    return;
  }
});

// 处理搜索框回车事件（委托在 body 上）
document.addEventListener('keypress', function (e) {
  if (e.key === 'Enter') {
    const input = e.target;
    if (input.matches('.search input[type="text"], #search-input')) {
      e.preventDefault();
      const keyword = input.value.trim();
      if (keyword) {
        renderSearchPage(keyword);
      }
    }
  }
});