async function renderSidebar() {
  try {
    // 1. 加载配置文件
    const response = await fetch('./config/sidebar.json');
    const config = await response.json();

    // 2. 根据 social 数组动态生成社交链接 HTML
    const socialHTML = config.social.map(item => `
      <li>
        <a href="${item.url}" target="_blank" rel="noopener noreferrer" title="${item.name}">
          ${item.svg}
        </a>
      </li>
    `).join('');

    // 3. 组装整个侧边栏（菜单部分保持硬编码，不再从 JSON 读取）
    const sidebarHTML = `
      <div class="sidebar">
        <!-- 头像区域 -->
        <div class="avatar">
          <div class="avatar-img">
            <a href="#">
              <img src="${config.avatar.img}" alt="">
            </a>
          </div>
          <span class="emoji">${config.avatar.emoji}</span>
        </div>

        <!-- 站点名称与描述 -->
        <h1 class="site-name">
          <a href="#">${config.site.name}</a>
        </h1>
        <h2 class="site-description">${config.site.description}</h2>

        <!-- 社交账号 -->
        <div class="menu-social">
          <ul>${socialHTML}</ul>
        </div>

        <!-- 主菜单（固定内容） -->
        <div class="main-menu">
          <ul>
            <li>
              <a href="#" data-page="home" class="active">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                  class="icon icon-tabler icons-tabler-outline icon-tabler-home">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M5 12l-2 0l9 -9l9 9l-2 0" />
                  <path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7" />
                  <path d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6" />
                </svg>
                <span>主页</span>
              </a>
            </li>

            <li>
              <a href="#" data-page="about">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                  class="icon icon-tabler icons-tabler-outline icon-tabler-user">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
                  <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
                </svg>
                <span>关于</span>
              </a>
            </li>

            <li>
              <a href="#" data-page="archives">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                  class="icon icon-tabler icons-tabler-outline icon-tabler-clipboard">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2" />
                  <path d="M9 5a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2" />
                </svg>
                <span>归档</span>
              </a>
            </li>

            <li>
              <a href="#" data-page="search">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                  class="icon icon-tabler icons-tabler-outline icon-tabler-search">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M3 10a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
                  <path d="M21 21l-6 -6" />
                </svg>
                <span>搜索</span>
              </a>
            </li>

            <li>
              <a href="#" data-page="friends">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                  class="icon icon-tabler icons-tabler-outline icon-tabler-link">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M9 15l6 -6" />
                  <path d="M11 6l.463 -.536a5 5 0 0 1 7.071 7.072l-.534 .464" />
                  <path d="M13 18l-.397 .534a5.068 5.068 0 0 1 -7.127 0a4.972 4.972 0 0 1 0 -7.071l.524 -.463" />
                </svg>
                <span>友链</span>
              </a>
            </li>

            <!-- 暗色模式 -->
            <li class="dark">
              <a href="#">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                  class="icon icon-tabler icons-tabler-outline icon-tabler-toggle-left">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M6 12a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
                  <path d="M2 12a6 6 0 0 1 6 -6h8a6 6 0 0 1 6 6a6 6 0 0 1 -6 6h-8a6 6 0 0 1 -6 -6" />
                </svg>
                <span>暗色模式</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    `;

    // 4. 插入 body 最前面
    document.body.insertAdjacentHTML('afterbegin', sidebarHTML);
  } catch (error) {
    console.error('侧边栏加载失败:', error);
  }
}
