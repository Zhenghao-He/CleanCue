const style = document.createElement('style');
style.textContent = '.app > div:nth-child(2) { visibility: hidden; }';
document.head.appendChild(style);
console.log("Plugin script loaded"); 
function addResizeCanvasListener() {
  // listen for our custom event
  document.addEventListener('resizecanvas', () => {
    const app = document.querySelector('.app')?.firstElementChild;
    const appWidth = app?.offsetWidth ?? 0;
    const pageWidth = document.documentElement.clientWidth;
    const adsWidth = window.screen.width < 1500 ? 180 : 320;

    if (!app || pageWidth - appWidth === 0) {
      return;
    }

    // update window.innerWidth and window.visualViewport.width
    // essentially we want to push the adds out of the viewport
    window.innerWidth = pageWidth + adsWidth;
    Object.defineProperty(window, 'visualViewport', {
      configurable: true,
      value: new Proxy(window.visualViewport, {
        get(target, property) {
          if (property === 'width') {
            return pageWidth + adsWidth;
          }
          return target[property];
        }
      }),
    });
  });
}

// inject our custom event listener into the "main world"
// otherwise we won't have access to the window object
document.documentElement.setAttribute('onreset', `(${addResizeCanvasListener})()`);
document.documentElement.dispatchEvent(new CustomEvent('reset'));
document.documentElement.removeAttribute('onreset');

function resize(event = {}) {
  if (!event.skip) {
    // trigger our custom event to update the width
    document.dispatchEvent(new CustomEvent('resizecanvas'));

    // trigger another resize event to update any listeners with the new width
    const resizeEvent = new Event('resize');
    resizeEvent.skip = true;
    window.dispatchEvent(resizeEvent);
  }
}

function highlightButtons(selector) {
  const buttons = document.querySelectorAll(selector);
  buttons.forEach(button => {
      button.classList.add('highlight');
  });
}
function highlightButtonsByTask(selector) {
  const buttons = document.querySelectorAll(selector);
  buttons.forEach(button => {
      button.classList.add('highlight');
  });
}





// highlightButtons('button:contains("Submit")');
// run when the window is resized
let debounce;
window.addEventListener('resize', event => {
  clearTimeout(debounce);
  debounce = setTimeout(() => resize(event), 100);
});

// run once when the DOM finishes loading
window.onload = () => {
  resize();
};

// document.addEventListener('DOMContentLoaded', () => {
//   // const targetElement = document.querySelector('.flexrow.app');
//   const targetElement = document.body; 
//   if (targetElement) {
//     const select = document.createElement('select');
//     select.innerHTML = `
//       <option value="option1">选项 1</option>
//       <option value="option2">选项 2</option>
//       <option value="option3">选项 3</option>
//     `;

//     targetElement.appendChild(select);

//     select.addEventListener('change', () => {
//       const selectedValue = select.value;
//       if (selectedValue === 'option1') {
//         alert('您选择了选项 1');
//       } else if (selectedValue === 'option2') {
//         alert('您选择了选项 2');
//       } else {
//         alert('您选择了选项 3');
//       }
//     });
//   }
// });
// 创建下拉框
const floatingSelect = document.createElement('select');
floatingSelect.innerHTML = `
  <option value="" disabled selected hidden>Please choose your task</option>
  <option value="option1">Resize an image</option>
  <option value="option2">Change image file format</option>
  <option value="option3">Flip or Rotate the image</option>
`;

// 设置样式，使下拉框悬浮
floatingSelect.style.position = 'fixed'; // 使用 fixed 让它悬浮
floatingSelect.style.top = '50px'; // 距离页面顶部 10px
floatingSelect.style.right = '30px'; // 距离页面右侧 10px
floatingSelect.style.zIndex = '1000'; // 确保下拉框在最上层
floatingSelect.style.padding = '5px'; // 添加一些内边距
floatingSelect.style.fontSize = '14px'; // 设置字体大小

// 插入到页面中
document.body.appendChild(floatingSelect);

// 添加事件监听
floatingSelect.addEventListener('change', () => {
  const selectedValue = floatingSelect.value;
  if (selectedValue === 'option1') {
    alert('Highlighed the buttons to resize the image');
  } else if (selectedValue === 'option2') {
    alert('Highlighed the buttons to change image file format');
  } else {
    alert('Highlighed the buttons to flip or rotate the image');
  }
});

// run once if we see the app injected into the DOM
const observer = new MutationObserver((mutationsList, observer) => {
  for (const mutation of mutationsList) {
    for (const addedNode of mutation.addedNodes) {
      if (
        addedNode.nodeType === Node.ELEMENT_NODE &&
        addedNode.classList.contains('app')
      ) {
        resize();
        observer.disconnect();
        break;
      }
    }
  }
});
observer.observe(document.body, { childList: true, subtree: true });


const observerButton = new MutationObserver((mutationsList) => {
  mutationsList.forEach((mutation) => {
    if (mutation.type === 'childList') {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
         
          const buttons = node.querySelectorAll('button');
          buttons.forEach((button) => {
            button.classList.add('highlight');
          });
        }
      });
    }
  });
});

observerButton.observe(document.body, { childList: true, subtree: true });
