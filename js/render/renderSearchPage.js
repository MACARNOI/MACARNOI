// js/render/renderSearchPage.js

/**
 * 渲染搜索结果页面
 * @param {string} keyword - 搜索关键词
 */
async function renderSearchPage(keyword = '') {
  const container = document.getElementById('dynamic-content');
  if (!container) return;

  container.innerHTML = '<p style="text-align:center;color:#707070;">搜索中...</p>';

  try {
    // 1. 加载文章索引
    const indexRes = await fetch('./posts/index.json');
    if (!indexRes.ok) throw new Error('索引加载失败');
    const allPosts = await indexRes.json();

    // 2. 如果没有关键词，显示空结果
    if (!keyword.trim()) {
      container.innerHTML = buildSearchHTML('', [], allPosts);
      return;
    }

    const lowerKeyword = keyword.toLowerCase();

    // 3. 并发加载所有文章的 Markdown 内容并搜索
    const results = await Promise.all(
      allPosts.map(async (post) => {
        try {
          const mdRes = await fetch(`./posts/${post.path}`);
          if (!mdRes.ok) return null;
          const mdText = await mdRes.text();
          const { content } = parseFrontMatter(mdText);

          // 检查标题和正文是否包含关键词（不区分大小写）
          const titleMatch = post.title.toLowerCase().includes(lowerKeyword);
          const contentMatch = content.toLowerCase().includes(lowerKeyword);

          if (titleMatch || contentMatch) {
            return {
              ...post,
              content,       // 用于提取摘要
              titleMatch,
              contentMatch
            };
          }
          return null;
        } catch {
          return null;
        }
      })
    );

    // 过滤掉未匹配的
    const matchedPosts = results.filter(Boolean);

    // 按日期降序排序
    matchedPosts.sort((a, b) => (b.date || '').localeCompare(a.date || ''));

    // 4. 构建搜索结果 HTML
    const html = buildSearchHTML(keyword, matchedPosts, allPosts);
    container.innerHTML = html;

    // 5. 绑定搜索框事件（页面内的搜索框）
    bindSearchEvents(container, keyword);

  } catch (error) {
    console.error('搜索失败:', error);
    container.innerHTML = '<p style="color:red;">搜索失败，请稍后再试。</p>';
  }
}

/**
 * 构建搜索页面完整 HTML
 */
function buildSearchHTML(keyword, results, allPosts) {
  const count = results.length;

  // 结果列表
  const resultsHTML = results.map(post => {
    const excerpt = generateExcerpt(post.content, keyword);
    const highlightedTitle = highlightText(post.title, keyword);
    const highlightedExcerpt = highlightText(excerpt, keyword);

    return `
      <li>
        <a href="#" data-page="blog" data-post="${post.path}">
          <div class="left">
            <h2 class="blog-title">${highlightedTitle}</h2>
            <span class="blog-content">${highlightedExcerpt}</span>
          </div>
          <div class="right">
            <img src="${post.cover || './assets/blog.png'}" alt="${post.title}">
          </div>
        </a>
      </li>
    `;
  }).join('');

  // 组装完整页面
  return `
    <div class="search">
      <div class="search-box">
        <input type="text" id="search-input" placeholder="输入关键词..." value="${escapeHtml(keyword)}">
        <a href="#" id="search-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
            class="icon icon-tabler icons-tabler-outline icon-tabler-search">
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M3 10a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
            <path d="M21 21l-6 -6" />
          </svg>
        </a>
      </div>

      ${keyword.trim() ? `
      <div class="search-done">
        <h2 class="done"><span class="count">${count}</span> 个结果</h2>
        <div class="search-done-box">
          <ul>${resultsHTML || '<li style="padding:25px;text-align:center;color:#767676;">未找到相关内容</li>'}</ul>
        </div>
      </div>
      ` : ''}
    </div>
  `;
}

/**
 * 生成摘要：优先截取包含关键词的片段，约 20 个字符（可调整）
 */
function generateExcerpt(content, keyword) {
  if (!content) return '';
  const plainText = content.replace(/[#*`_>\[\]()\n]/g, ' ').replace(/\s+/g, ' ').trim();
  const lowerText = plainText.toLowerCase();
  const lowerKeyword = keyword.toLowerCase();

  const index = lowerText.indexOf(lowerKeyword);
  let start = 0;
  const maxLen = 40; // 粗略 40 字符，对应约 20 个中文字

  if (index !== -1) {
    // 从关键词往前取一些，往后取一些
    start = Math.max(0, index - Math.floor(maxLen / 2));
  } else {
    start = 0;
  }
  let excerpt = plainText.slice(start, start + maxLen).trim();
  if (start > 0) excerpt = '...' + excerpt;
  if (start + maxLen < plainText.length) excerpt += '...';
  return excerpt;
}

/**
 * 高亮文本中的关键词（用 <mark> 标签）
 */
function highlightText(text, keyword) {
  if (!keyword.trim()) return text;
  const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escaped})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
}

/**
 * 转义 HTML 字符，防止 XSS
 */
function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/**
 * 绑定搜索框事件（回车 / 点击图标）
 */
function bindSearchEvents(container, currentKeyword) {
  const input = container.querySelector('#search-input');
  const btn = container.querySelector('#search-btn');
  if (!input || !btn) return;

  const doSearch = () => {
    const newKeyword = input.value.trim();
    if (newKeyword !== currentKeyword.trim()) {
      renderSearchPage(newKeyword);
    }
  };

  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      doSearch();
    }
  });

  btn.addEventListener('click', (e) => {
    e.preventDefault();
    doSearch();
  });
}

/**
 * 解析 Front Matter（复用）
 */
function parseFrontMatter(mdText) {
  const match = mdText.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)/);
  if (!match) return { title: '未命名', date: '', content: mdText };
  const frontMatterStr = match[1];
  const body = match[2];
  const meta = {};
  frontMatterStr.split('\n').forEach(line => {
    const idx = line.indexOf(':');
    if (idx !== -1) {
      const key = line.slice(0, idx).trim();
      const value = line.slice(idx + 1).trim();
      meta[key] = value;
    }
  });
  return {
    title: meta.title || '未命名',
    date: meta.date || '',
    content: body
  };
}

// 挂载全局
window.renderSearchPage = renderSearchPage;

// <!-- 搜索页面 -->
//       <div class="search">
//         <div class="search-box">
//           <input type="text" placeholder="输入关键词...">
//           <a href="#">
//             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
//               stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
//               class="icon icon-tabler icons-tabler-outline icon-tabler-search">
//               <path stroke="none" d="M0 0h24v24H0z" fill="none" />
//               <path d="M3 10a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
//               <path d="M21 21l-6 -6" />
//             </svg>
//           </a>
//         </div>

//         <div class="search-done">
//           <h2 class="done"><span class="count">4</span> 个结果</h2>
//           <div class="search-done-box">
//             <ul>
//               <li>
//                 <a href="#">
//                   <div class="left">
//                     <h2 class="blog-title">捐赠月度总结</h2>
//                     <span class="blog-content">这里放博客内容</span>
//                   </div>
//                   <div class="right">
//                     <img src="./assets/blog.png" alt="">
//                   </div>
//                 </a>
//               </li>

//               <li>
//                 <a href="#">
//                   <div class="left">
//                     <h2 class="blog-title">捐赠月度总结</h2>
//                     <span class="blog-content">这里放博客内容</span>
//                   </div>
//                   <div class="right">
//                     <img src="./assets/blog.png" alt="">
//                   </div>
//                 </a>
//               </li>
//             </ul>
//           </div>
//         </div>