// js/events/horizontalScroll.js

/**
 * 让指定的容器支持鼠标滚轮横向滚动
 * @param {string} selector - 需要横向滚动的容器选择器
 */
function initHorizontalScroll(selector) {
  const containers = document.querySelectorAll(selector);
  if (!containers.length) return;

  containers.forEach(container => {
    container.addEventListener('wheel', (e) => {
      // 如果容器没有横向溢出，则不处理
      if (container.scrollWidth <= container.clientWidth) return;

      e.preventDefault();
      // 将垂直滚动量（deltaY）直接加到横向滚动位置
      container.scrollLeft += e.deltaY;
    }, { passive: false }); // passive: false 允许 preventDefault
  });
}

window.initHorizontalScroll = initHorizontalScroll;