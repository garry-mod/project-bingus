const input = document.getElementById('launcher-input');
const sendBtn = document.getElementById('send-btn');
const workspace = document.getElementById('workspace');
const startButton = document.getElementById('start-button');
const launcherBox = document.getElementById('launcher-box');

let topZ = 10;

// turn all into real url??
// if not url its google search 
function resolveToUrl(value) {
  if (/^https?:\/\//i.test(value)) return value;
  if (/^[\w-]+\.[a-z]{2,}(\/.*)?$/i.test(value)) return `https://${value}`;
  return `https://www.google.com/search?q=${encodeURIComponent(value)}`;
}

function handleLauncherSubmit() {
  const value = input.value.trim();
  if (!value) return;
  input.value = '';
  createAppWindow(resolveToUrl(value));
}

input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') handleLauncherSubmit();
});

sendBtn.addEventListener('click', handleLauncherSubmit);

// wire up the quick access icons feature cards and suggestion chips
// to real sites using each elements data url attribute set in index.html.
document.querySelectorAll('[data-url]').forEach((el) => {
  el.addEventListener('click', () => {
    createAppWindow(el.dataset.url);
  });
});

// start button toggles the launcher card's visibility
startButton.addEventListener('click', () => {
  const isHidden = launcherBox.style.display === 'none';
  launcherBox.style.display = isHidden ? '' : 'none';
  startButton.classList.toggle('active', isHidden);
});

function createAppWindow(url) {
  const taskbarApps = document.getElementById('taskbar-apps');

  const taskbarApp = document.createElement('button');
  taskbarApp.className = 'taskbar-app active';
  taskbarApp.title = url;
  taskbarApp.textContent = '🌐';

  taskbarApps.appendChild(taskbarApp);

  const win = document.createElement('div');
  win.className = 'app-window';
  win.style.left = '100px';
  win.style.top = '100px';
  win.style.width = '800px';
  win.style.height = '600px';
  win.style.zIndex = ++topZ;

  let normalRect = null;
  let isMaximized = false;
  let isHidden = false;

  const titleBar = document.createElement('div');
  titleBar.className = 'app-window-titlebar';
  titleBar.innerHTML = `<span>${url}</span>`;

  const controls = document.createElement('div');
  controls.className = 'app-window-controls';

  const minimizeBtn = document.createElement('span');
  minimizeBtn.className = 'app-window-btn';
  minimizeBtn.textContent = '—';
  minimizeBtn.addEventListener('click', (e) => {
    win.style.display = 'none';
    taskbarApp.classList.remove('active');
    isHidden = true;
  });

  const maximizeBtn = document.createElement('span');
  maximizeBtn.className = 'app-window-btn';
  maximizeBtn.textContent = '▢';
  maximizeBtn.addEventListener('click', () => {
    if (!isMaximized) {
      normalRect = {
        left: win.style.left,
        top: win.style.top,
        width: win.style.width,
        height: win.style.height,
      };
      win.style.left = '0px';
      win.style.top = '0px';
      win.style.width = '100%';
      win.style.height = '100%';
      isMaximized = true;
    } else {
      win.style.left = normalRect.left;
      win.style.top = normalRect.top;
      win.style.width = normalRect.width;
      win.style.height = normalRect.height;
      isMaximized = false;
    }
  });

  const closeBtn = document.createElement('span');
  closeBtn.className = 'app-window-btn app-window-close';
  closeBtn.textContent = '×';
  closeBtn.addEventListener('click', () => {
    win.remove();
    taskbarApp.remove();
  });

  controls.appendChild(minimizeBtn);
  controls.appendChild(maximizeBtn);
  controls.appendChild(closeBtn);
  titleBar.appendChild(controls);

  const webview = document.createElement('webview');
  webview.src = url;
  webview.className = 'app-window-webview';

  const resizeHandle = document.createElement('div');
  resizeHandle.className = 'app-window-resize';

  win.appendChild(titleBar);
  win.appendChild(webview);
  win.appendChild(resizeHandle);
  workspace.appendChild(win);

  makeDraggable(win, titleBar);
  makeResizable(win, resizeHandle);

  taskbarApp.addEventListener('click', () => {
    if (isHidden) {
      win.style.display = '';
      win.style.zIndex = ++topZ;
      taskbarApp.classList.add('active');
      isHidden = false;
    } else {
      win.style.display = 'none';
      taskbarApp.classList.remove('active');
      isHidden = true;
    }
  });

  win.addEventListener('mousedown', () => {
    win.style.zIndex = ++topZ;
  });
}

function makeDraggable(win, handle) {
  handle.addEventListener('mousedown', (e) => {
    const startX = e.clientX;
    const startY = e.clientY;
    const startLeft = win.offsetLeft;
    const startTop = win.offsetTop;

    function onMouseMove(e) {
      win.style.left = `${startLeft + (e.clientX - startX)}px`;
      win.style.top = `${startTop + (e.clientY - startY)}px`;
    }
    function onMouseUp() {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    }
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });
}

function makeResizable(win, handle) {
  handle.addEventListener('mousedown', (e) => {
    e.stopPropagation();
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = win.offsetWidth;
    const startHeight = win.offsetHeight;

    function onMouseMove(e) {
      win.style.width = `${startWidth + (e.clientX - startX)}px`;
      win.style.height = `${startHeight + (e.clientY - startY)}px`;
    }
    function onMouseUp() {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    }
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });
}

function updateClock() {
  const now = new Date();

  document.getElementById("clock").textContent =
      now.toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit"
      });
}

updateClock();
setInterval(updateClock, 1000);