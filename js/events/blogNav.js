// js/events/blogNav.js

function initBlogNav() {
  const article = document.querySelector('.article-content');
  const tocContainer = document.getElementById('toc-container');
  if (!article || !tocContainer) return;

  // 1. 收集所有带 id 的标题
  const headings = Array.from(article.querySelectorAll('h1[id],h2[id],h3[id],h4[id],h5[id],h6[id]'));
  if (headings.length === 0) return;

  // 2. 生成目录 HTML
  const tocHTML = buildTocHTML(headings);
  tocContainer.innerHTML = tocHTML;

  // 3. 所有目录链接
  const tocLinks = Array.from(tocContainer.querySelectorAll('a'));

  // 4. 点击目录项 → 仅平滑滚动，不手动设置 active
  tocContainer.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (!link) return;
    e.preventDefault();

    const targetId = link.getAttribute('href').slice(1);
    const target = document.getElementById(targetId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });

  // 5. 监听滚动，自动更新 active（节流）
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateActiveOnScroll(headings, tocLinks);
        ticking = false;
      });
      ticking = true;
    }
  });

  // 初始执行一次
  updateActiveOnScroll(headings, tocLinks);
}

/**
 * 根据当前滚动位置，计算离视口顶部最近的标题并高亮对应目录项
 */
function updateActiveOnScroll(headings, tocLinks) {
  const buffer = 80;  // 提前量（像素），可自行调整

  let activeHeading = null;
  let minDistance = Infinity;

  headings.forEach(heading => {
    const rect = heading.getBoundingClientRect();
    const distance = rect.top - buffer;

    // 选择越过“提前线”且距离最小的标题（即当前章节）
    if (distance <= 0 && Math.abs(distance) < minDistance) {
      minDistance = Math.abs(distance);
      activeHeading = heading;
    }
  });

  // 如果没有任何标题越过提前线（页面顶部），则默认第一个标题
  if (!activeHeading && headings.length > 0) {
    activeHeading = headings[0];
  }

  // 更新目录的 active 样式
  if (activeHeading) {
    const activeId = activeHeading.getAttribute('id');
    tocLinks.forEach(link => {
      const href = link.getAttribute('href');
      link.classList.toggle('active', href === `#${activeId}`);
    });
  }
}

/**
 * 根据标题数组生成嵌套的目录 HTML（ol/ul）
 */
function buildTocHTML(headings) {
  if (headings.length === 0) return '<p>暂无目录</p>';

  const topLevel = 2; // 从 h2 开始
  let html = '<ol>';
  let currentLevel = topLevel;
  const stack = [];

  headings.forEach(heading => {
    const level = parseInt(heading.tagName.slice(1));
    const text = heading.textContent.trim();
    const id = heading.getAttribute('id');

    if (level > currentLevel) {
      html += '<ul>';
      stack.push('ul');
    }
    while (level < currentLevel && stack.length > 0) {
      const last = stack.pop();
      html += `</${last}>`;
      currentLevel--;
    }

    html += `<li><a href="#${id}">${text}</a></li>`;
    currentLevel = level;
  });

  while (stack.length > 0) {
    const last = stack.pop();
    html += `</${last}>`;
  }
  html += '</ol>';
  return html;
}

window.initBlogNav = initBlogNav;