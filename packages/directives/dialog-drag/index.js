export default {
  bind(el, binding, vnode) {
    const dialogHeaderEl = el.querySelector('.el-dialog__header');
    const dragDOM = el.querySelector('.el-dialog');
    dialogHeaderEl.style.cssText += ';cursor:move;';
    dragDOM.style.cssText += ';top:0px;';

    // 获取原有属性 ie dom元素.currentStyle 火狐谷歌 window.getComputedStyle(dom元素, null);
    const getStyle = (function () {
      if (window.document.currentStyle) {
        return (dom, attr) => dom.currentStyle[attr];
      } else {
        return (dom, attr) => getComputedStyle(dom, false)[attr];
      }
    })();

    dialogHeaderEl.onmousedown = (e) => {
      // 鼠标按下，计算当前元素距离可视区的距离
      const disX = e.clientX - dialogHeaderEl.offsetLeft;
      const disY = e.clientY - dialogHeaderEl.offsetTop;

      const dragDOMWidth = dragDOM.offsetWidth;
      const dragDOMHeight = dragDOM.offsetHeight;

      const screenWidth = document.body.clientWidth;
      const screenHeight = document.body.clientHeight;

      const minDragDOMLeft = dragDOM.offsetLeft;
      const maxDragDOMLeft = screenWidth - dragDOM.offsetLeft - dragDOMWidth;

      const minDragDOMTop = dragDOM.offsetTop;
      const maxDragDOMTop = screenHeight - dragDOM.offsetTop - dragDOMHeight;

      // 获取到的值带px 正则匹配替换
      let styL = getStyle(dragDOM, 'left');
      let styT = getStyle(dragDOM, 'top');

      if (styL.includes('%')) {
        styL = +document.body.clientWidth * (+styL.replace(/%/g, '') / 100);
        styT = +document.body.clientHeight * (+styT.replace(/%/g, '') / 100);
      } else {
        styL = +styL.replace(/\px/g, '');
        styT = +styT.replace(/\px/g, '');
      }

      document.onmousemove = function (e) {
        // 通过事件委托，计算移动的距离
        let left = e.clientX - disX;
        let top = e.clientY - disY;

        // 边界处理
        if (-left > minDragDOMLeft) {
          left = -minDragDOMLeft;
        } else if (left > maxDragDOMLeft) {
          left = maxDragDOMLeft;
        }

        if (-top > minDragDOMTop) {
          top = -minDragDOMTop;
        } else if (top > maxDragDOMTop) {
          top = maxDragDOMTop;
        }

        // 移动当前元素
        dragDOM.style.cssText += `;left:${left + styL}px;top:${top + styT}px;`;

        // emit onDrag event
        vnode.child.$emit('dragDialog');
      };

      document.onmouseup = function () {
        document.onmousemove = null;
        document.onmouseup = null;
      };
    };
  }
};
