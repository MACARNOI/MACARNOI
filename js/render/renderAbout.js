// js/render/renderAbout.js

/**
 * 渲染“关于”页面到 #dynamic-content
 * 从 Markdown 文件加载内容并显示为文章详情
 */
async function renderAboutPage() {
  const container = document.getElementById('dynamic-content');
  if (!container) {
    console.error('找不到 #dynamic-content 容器');
    return;
  }

  // 显示加载中
  container.innerHTML = '<p style="text-align:center;color:#707070;">加载中...</p>';

  try {
    // 1. 加载 Markdown 文件（路径根据实际情况调整）
    const response = await fetch('./posts/about.md');
    if (!response.ok) throw new Error('关于页面资源不存在');
    const mdText = await response.text();

    // 2. 解析 Front Matter 和正文
    const post = parseFrontMatter(mdText);

    // 3. 用 marked 将正文转为 HTML
    const contentHTML = marked.parse(post.content);

    // 4. 构建页面 HTML（可自行调整结构，例如添加一个返回按钮或背景卡片）
    const pageHTML = `
      <div class="about-page">
        <article class="post-detail">
          <h1 class="post-title">${post.title}</h1>
          ${post.date ? `<time class="post-date">${post.date}</time>` : ''}
          <div class="post-body">
            ${contentHTML}
          </div>
        </article>
      </div>
    `;

    // 5. 插入容器
    container.innerHTML = pageHTML;

  } catch (error) {
    console.error('渲染关于页面失败:', error);
    container.innerHTML = '<p style="color:red;">无法加载关于页面，请稍后再试。</p>';
  }
}

/**
 * 解析 Markdown 文件中的 Front Matter（元数据）
 * 与 renderBlogCards.js 中相同的函数，可后续提取为公共工具
 * @param {string} mdText 原始 Markdown 字符串
 * @returns {{ title: string, date: string, content: string }}
 */
function parseFrontMatter(mdText) {
  const match = mdText.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)/);
  if (!match) {
    return {
      title: '关于',
      date: '',
      content: mdText
    };
  }

  const frontMatterStr = match[1];
  const body = match[2];

  const meta = {};
  frontMatterStr.split('\n').forEach(line => {
    const [key, ...rest] = line.split(':');
    if (key && rest.length) {
      meta[key.trim()] = rest.join(':').trim();
    }
  });

  return {
    title: meta.title || '关于',
    date: meta.date || '',
    content: body
  };
}

// 挂载到全局，以便 sidebarEvents.js 中调用
window.renderAboutPage = renderAboutPage;