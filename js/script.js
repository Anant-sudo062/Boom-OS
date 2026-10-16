document.addEventListener('DOMContentLoaded', () => {
    Boot.start();
});

document.addEventListener('boot:complete', () => {
    Desktop.init();
});