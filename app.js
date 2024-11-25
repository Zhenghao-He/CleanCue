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
function highlightButtonsByResize() {
  const buttons = document.querySelectorAll('.topbar button');
  const fileButton = buttons[0];
  if (fileButton) {
    // fileButton is the first button in the topbar
    fileButton.classList.add('highlight');
  }
  // const toolbtn = document.querySelectorAll('.toolbtn');
  // const btn_gsicon = toolbtn[4];
  // if (btn_gsicon) {
  //   btn_gsicon.classList.add('highlight');
  // }

  const cropButton = document.querySelector('div.sbar.toolbar > div > button:nth-child(5)');
  cropButton.classList.add('highlight'); // 添加高亮类

  const cancelButton = document.querySelector('button.fitem[title="Cancel"]');
  const confirmButton = document.querySelector('button.fitem[title="Confirm"]');
  
  // 添加高亮
  cancelButton.classList.add('highlight');
  confirmButton.classList.add('highlight');
  

// //body > div.flexrow.app > div:nth-child(1) > div:nth-child(1) > div > div.body.flexrow > div:nth-child(2) > div > button:nth-child(6)
//   const saveButton = document.querySelector('div.body.flexrow > div:nth-child(2) > div > button:nth-child(6)');
//   saveButton.classList.add('highlight'); // 添加高亮类

}

function highlightButtonsByFormat() {
}

function highlightButtonsByRotate() {
}
function highlightBasedOnSelection(selectedValue) {
  if (selectedValue === 'option1') {
    console.log('Highlighting buttons to resize the image...');
    highlightButtonsByResize(); // 调用具体的高亮逻辑
  } else if (selectedValue === 'option2') {
    console.log('Highlighting buttons to change image file format...');
    highlightButtonsByFormat();
  } else if (selectedValue === 'option3') {
    console.log('Highlighting buttons to flip or rotate the image...');
    highlightButtonsByRotate();
  }
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
floatingSelect.style.top = '34px'; // 距离页面顶部 10px
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
    // highlightButtonsByResize();
  } else if (selectedValue === 'option2') {
    alert('Highlighed the buttons to change image file format');
  } else {
    alert('Highlighed the buttons to flip or rotate the image');
  }
});
// let lastValue = floatingSelect.value;
document.addEventListener('click', () => {
  const currentValue = floatingSelect.value; // 获取当前选中值
  if (currentValue === 'option1') {
    console.log('Resizing buttons highlighted');
    highlightButtonsByResize();
  } else if (currentValue === 'option2') {
    console.log('File format buttons highlighted');
    highlightButtonsByFormat();
  } else if (currentValue === 'option3') {
    console.log('Flip/Rotate buttons highlighted');
    highlightButtonsByFlipOrRotate();
  }
});

// // 持续高亮逻辑，防止页面跳转后状态丢失
// setInterval(() => {
//   const currentValue = localStorage.getItem('selectedTask');
//   if (currentValue) {
//     highlightBasedOnSelection(currentValue); // 持续检查并高亮
//   }
// }, 1000); // 每秒检查一次状态


// run once if we see the app injected into the DOM
const observer = new MutationObserver((mutationsList, observer) => {
  for (const mutation of mutationsList) {
    for (const addedNode of mutation.addedNodes) {
      if (
        addedNode.nodeType === Node.ELEMENT_NODE &&
        addedNode.classList.contains('app')
      ) {
        resize();
        const currentValue = floatingSelect.value; // 获取当前选中值
        if (currentValue === 'option1') {
          console.log('Resizing buttons highlighted');
          highlightButtonsByResize();
        } else if (currentValue === 'option2') {
          console.log('File format buttons highlighted');
          highlightButtonsByFormat();
        } else if (currentValue === 'option3') {
          console.log('Flip/Rotate buttons highlighted');
          highlightButtonsByFlipOrRotate();
        }
        // highlightButtonsByResize();
        observer.disconnect();
        break;
      }
    }
  }
});
observer.observe(document.body, { childList: true, subtree: true });


// const observerButton = new MutationObserver((mutationsList) => {
//   mutationsList.forEach((mutation) => {
//     if (mutation.type === 'childList') {
//       mutation.addedNodes.forEach((node) => {
//         if (node.nodeType === Node.ELEMENT_NODE) {
         
//           const buttons = node.querySelectorAll('.topbar button');
//           buttons.forEach((button) => {
//             button.classList.add('highlight');
//           });
//         }
//       });
//     }
//   });
// });

// observerButton.observe(document.body, { childList: true, subtree: true });
