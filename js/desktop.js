(function () {
    const desktop = document.querySelector('#desktop');
    const iconsLayer = document.querySelector('#desktop-icons');
    const windowLayer = document.querySelector('#window-layer');
    const taskbar = document.querySelector('#taskbar');
    const runningApps = document.querySelector('#running-apps');
    const startButton = document.querySelector('#start-button');
    const clockEl = document.querySelector('#clock');

    const apps = [
        { id: 'projects', glyph: '▣', label: 'Projects'},
        { id: 'hours', glyph: '◈', label: 'Hours'},
        { id: 'prizes', glyph: '✦', label: 'Prizes'},
        { id: 'terminal', glyph: '☰', label: 'Terminal'},
    ];
    const openWindows = {};
    let zTop = 10;

    function init() {
         desktop.classList.add('visible');
         renderIcons();
         setTimeout( () => taskbar.classList.add('visible'), 500);
         startClock();
         startButton.addEventListener('click', () => startButton.classList.toggle('active'));
    }

    function renderIcons(){
        apps.forEach( (app, i) => {
            const icon = document.createElement('div');
            icon.className = 'icon';
            icon.style.animationDelay = `${i * 0.12}s`;
            icon.innerHTML = `
            <div class = "icon-glyph">${app.glyph}</div>
            <div class = "icon-label">${app.label}</div>
            `;
            icon.addEventListener('click', () => openWindow(app));
            iconsLayer.appendChild(icon);
        });
    }
    
    function openWindow(app){
        if (openWindows [app.id]){
            focusWindow(app.id);
            return;
        }
        const offset = Object.keys(openWindows).length *26;
        const win = document.createElement('div');
        win.className = 'window';
        win.style.left = `${140 + offset}px`;
        win.style.top = `${80 + offset}px`;
        win.innerHTML = `
            <div class = "window-header"
                <span clss="window-title">${app.label}</span>
                <button class="window-close">✕</button>
            </div>
            <div class="wimdow-body">Content for ${app.label}goes here.</div>
            `;
            windowsLayer.appendChild(win);
            win.addEventListener('mousedown', () => focusWindow(app.id));
            win.querySelector('.window-close').addEventListener('click', (e) => {
                e.stopPropagation();
                closeWindow(app.id);
            });
            makeDraggable(win, win.querySelector('.window-header'));

            const appBtn = document.createElement('button');
            appBtn.className = 'app-btn';
            appBtn.textContent = app.label;
            appBtn.addEventListener('click', () => focusWindow(app.id));
            runningApps.appendChild(appBtn);
            openWindows[app.id] = { win, appBtn};
            focusWindow(app.id);
    }

    function focusWindow(id){
        Object.entries(openWindows). forEach(([key, {win, appBtn }]) => {
            const isActive = key === id;
            appBtn.classList.toggle('active', isActive);
            if (isActive) win.style.zIndex = ++zTop;
        });
    }
    function closeWindow(id) {
        const entry = openWindows[id];
        if (!entry) return;
        entry.win.remove();
        entry.appBtn.remove();
        delete openWindows[id];
    }
    function makeDraggable(win, handle){
        let dragging = false;
        let offsetX = 0;
        let offsetY = 0;

        handle.addEventListener('mousedown', (e) => {
            dragging = true;
            offsetX = e.clientX - win.offsetLeft;
            offsetY = e.clientY - win.offsetTop;
        });
        document.addEventListener('mousemove', (e) => {
            if (!dragging) return;
            win.style.left = `${e.clientX - offsetX}px`;
            win.style.top = `${e.clientY - offsetY}px`;
        });
        document.addEventListener('mouseup', () => {dragging = false; });
    }
    //Clock
    function startClock(){
        const update = () => {
            const now = new Date();
            const h = String(now.getHours()).padStart(2, '0');
            const m = String(now.getMinutes()).padStart(2, '0');
            clockEl.textContent = `${h}:${m}`;
        };
        update();
        setInterval(update, 15000);
    }
    window.Desktop = {init};
})();