// js/render/renderAbout.js

async function renderAboutPage() {
  const container = document.getElementById('dynamic-content');
  if (!container) return;

  container.innerHTML = '<p style="text-align:center;color:#707070;">加载中...</p>';

  try {
    // 1. 加载 Markdown 文件
    const response = await fetch('./posts/about.md');
    if (!response.ok) throw new Error('关于页面不存在');
    const mdText = await response.text();

    // 2. 解析 Front Matter 和正文
    const post = parseFrontMatter(mdText);
    const contentHTML = marked.parse(post.content);

    // 3. 构建完整的关于页面 HTML（头部固定，正文插入，版权栏固定）
    const aboutHTML = `
      <div class="about">
        <article class="main-article">
          <header class="article-header">
            <div class="title">
              <h2><a href="#">关于</a></h2>
            </div>
          </header>
          <section class="article-content">
            ${contentHTML}
          </section>
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
    `;

    container.innerHTML = aboutHTML;

  } catch (error) {
    console.error('渲染关于页面失败:', error);
    container.innerHTML = '<p style="color:red;">无法加载关于页面，请稍后再试。</p>';
  }
}

// 解析 Front Matter（与之前相同，可提取为公共函数）
function parseFrontMatter(mdText) {
  const match = mdText.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)/);
  if (!match) {
    return { title: '关于', date: '', content: mdText };
  }
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
    title: meta.title || '关于',
    date: meta.date || '',
    content: body
  };
}

window.renderAboutPage = renderAboutPage;