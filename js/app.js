// // 全局存储文章索引
// let postsData = [];

// // 初始化：加载文章索引，并设置侧边栏事件
// async function init() {
//   await loadPostsIndex();
//   bindSidebarEvents();
//   // 默认显示主页
//   renderHome();
// }

// // 加载 list.json
// async function loadPostsIndex() {
//   const res = await fetch('posts/list.json');
//   postsData = await res.json();
// }

// // 侧边栏菜单点击事件绑定
// function bindSidebarEvents() {
//   // 获取所有侧边栏菜单项（根据你的 HTML 结构调整选择器）
//   const menuItems = document.querySelectorAll('.main-menu a');
//   menuItems.forEach(item => {
//     item.addEventListener('click', async (e) => {
//       e.preventDefault();
//       // 移除所有菜单项的 active 类，然后给当前项添加
//       document.querySelectorAll('.main-menu a').forEach(a => a.classList.remove('active'));
//       item.classList.add('active');

//       const text = item.querySelector('span')?.innerText || '';
//       if (text.includes('主页')) {
//         renderHome();
//       } else if (text.includes('关于')) {
//         renderAbout();
//       } else if (text.includes('归档')) {
//         renderArchive();
//       } else if (text.includes('搜索')) {
//         renderSearch();
//       } else if (text.includes('友链')) {
//         renderFriends();
//       }
//     });
//   });
// }

// // 渲染主页：显示文章列表
// async function renderHome() {
//   const container = document.getElementById('dynamic-content');
//   let html = `<h1>所有文章</h1><div class="post-list">`;
//   for (let post of postsData) {
//     html += `
//       <div class="post-card">
//         <h2><a href="#" class="post-link" data-filename="${post.filename}">${post.title}</a></h2>
//         <div class="post-meta">${post.date}</div>
//         <p class="post-summary">${post.summary}</p>
//       </div>
//     `;
//   }
//   html += `</div>`;
//   container.innerHTML = html;

//   // 绑定每篇文章的点击事件
//   document.querySelectorAll('.post-link').forEach(link => {
//     link.addEventListener('click', async (e) => {
//       e.preventDefault();
//       const filename = link.dataset.filename;
//       await renderPost(filename);
//     });
//   });
// }

// // 渲染单篇 Markdown 文章
// async function renderPost(filename) {
//   const res = await fetch(`posts/${filename}`);
//   const mdText = await res.text();
//   const htmlContent = marked.parse(mdText);
//   const container = document.getElementById('dynamic-content');
//   container.innerHTML = `
//     <article class="post-full">${htmlContent}</article>
//     <p><a href="#" id="back-home">← 返回主页</a></p>
//   `;
//   document.getElementById('back-home').addEventListener('click', (e) => {
//     e.preventDefault();
//     renderHome();
//   });
// }

// // 关于页面（从 about.md 加载）
// async function renderAbout() {
//   const res = await fetch('posts/about.md');
//   const mdText = await res.text();
//   const htmlContent = marked.parse(mdText);
//   document.getElementById('dynamic-content').innerHTML = htmlContent;
// }

// // 归档页面：按年月分组展示
// function renderArchive() {
//   const groups = {};
//   postsData.forEach(post => {
//     const year = post.date.slice(0, 4);
//     if (!groups[year]) groups[year] = [];
//     groups[year].push(post);
//   });
//   let html = `<h1>归档</h1>`;
//   for (let year in groups) {
//     html += `<h2>${year}</h2><ul>`;
//     groups[year].forEach(post => {
//       html += `<li><a href="#" class="post-link" data-filename="${post.filename}">${post.title}</a> (${post.date})</li>`;
//     });
//     html += `</ul>`;
//   }
//   document.getElementById('dynamic-content').innerHTML = html;
//   // 重新绑定文章链接
//   document.querySelectorAll('.post-link').forEach(link => {
//     link.addEventListener('click', async (e) => {
//       e.preventDefault();
//       await renderPost(link.dataset.filename);
//     });
//   });
// }

// // 搜索功能（简单前端过滤）
// function renderSearch() {
//   const container = document.getElementById('dynamic-content');
//   container.innerHTML = `
//     <h1>搜索文章</h1>
//     <input type="text" id="search-input" placeholder="输入关键词..." style="width:100%; padding:8px;">
//     <div id="search-results"></div>
//   `;
//   const input = document.getElementById('search-input');
//   input.addEventListener('input', (e) => {
//     const keyword = e.target.value.toLowerCase();
//     const filtered = postsData.filter(post =>
//       post.title.toLowerCase().includes(keyword) ||
//       post.summary.toLowerCase().includes(keyword)
//     );
//     let resultsHtml = `<div class="post-list">`;
//     filtered.forEach(post => {
//       resultsHtml += `
//         <div class="post-card">
//           <h2><a href="#" class="post-link" data-filename="${post.filename}">${post.title}</a></h2>
//           <p>${post.summary}</p>
//         </div>
//       `;
//     });
//     resultsHtml += `</div>`;
//     document.getElementById('search-results').innerHTML = resultsHtml;
//     // 绑定新生成的链接
//     document.querySelectorAll('#search-results .post-link').forEach(link => {
//       link.addEventListener('click', async (e) => {
//         e.preventDefault();
//         await renderPost(link.dataset.filename);
//       });
//     });
//   });
// }

// // 友链页面（简单静态）
// function renderFriends() {
//   document.getElementById('dynamic-content').innerHTML = `
//     <h1>友情链接</h1>
//     <ul>
//       <li><a href="#">示例博客</a></li>
//       <li><a href="#">Palentum 的实验室</a></li>
//     </ul>
//   `;
// }

// // 启动
// init();