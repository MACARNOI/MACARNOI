// js/render/renderFriendsPage.js

async function renderFriendsPage() {
  const container = document.getElementById('dynamic-content');
  if (!container) return;

  container.innerHTML = '<p style="text-align:center;color:#707070;">加载友链...</p>';

  try {
    // 1. 加载友链数据
    const res = await fetch('./config/friends.json');
    if (!res.ok) throw new Error('友链配置加载失败');
    const friends = await res.json();

    // 2. 如果没有友链，不渲染列表
    const friendsListHTML = friends.length > 0 ? `
      <div class="link-box">
        <ul>
          ${friends.map(friend => `
            <li>
              <a href="${friend.url}" target="_blank" rel="noopener noreferrer">
                <div class="left">
                  <h2 class="link-title">${escapeHtml(friend.title)}</h2>
                  <span class="link-description">${escapeHtml(friend.description || '')}</span>
                </div>
                <div class="right">
                  <img src="${friend.icon || './assets/blog.png'}" alt="${escapeHtml(friend.title)}">
                </div>
              </a>
            </li>
          `).join('')}
        </ul>
      </div>
    ` : '';

    // 3. 组装完整页面（包含版权栏）
    const html = `
      <div class="link">
        <div class="link-card">
          <article class="main-article">
            <header class="article-header">
              <div class="title">
                <h2><a href="#">友链</a></h2>
              </div>
            </header>
          </article>
          <div class="blog-rooter">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
              class="icon icon-tabler icons-tabler-outline icon-tabler-copyright">
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
              <path d="M14 9.75a3.016 3.016 0 0 0 -4.163 .173a2.993 2.993 0 0 0 0 4.154a3.016 3.016 0 0 0 4.163 .173" />
            </svg>
            <span>Licensed under CC BY-NC-SA 4.0</span>
          </div>
        </div>

        ${friendsListHTML}
      </div>
    `;

    container.innerHTML = html;
  } catch (error) {
    console.error('加载友链失败:', error);
    container.innerHTML = '<p style="color:red;">友链加载失败，请检查配置文件。</p>';
  }
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

window.renderFriendsPage = renderFriendsPage;