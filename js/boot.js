(function () {
    const bootScreen = document.getElementById('boot-screen');
    const messageEl = document.getElementById('boot-message');
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');

    const messages = [
        {at: 0, text: 'Initializing OS kernel'},
        {at: 25, text: 'Loading drivers'},
        {at: 50, text: 'Mounting filesystem'},
        {at: 75, text: 'Starting services'},
        {at: 95, text: 'Almost there'},
    ];
    const FILL_DURATION = 2600;
    const HOLD_AT_FULL = 400;
    const FADE_DURATION = 900;

    function start() {
        const startTime = performance.now();
        requestAnimationFrame(function tick(now) {
            const elapsed = now - startTime;
            const progress = Math.min(100, Math.round((elapsed / FILL_DURATION) *100));
            progressBar.style.width = progress + '%';
            progressText.textContent = progress + '%';

            const current = [...messages].reverse().find(m => progress >= m.at);
            if(current) messageEl.textContent = current.text;

            if(progress < 100){
                requestAnimationFrame(tick);
            }
            else {
                setTimeout(finish, HOLD_AT_FULL);
            }
        });
    }

    function finish() {
        bootScreen.classList.add('hide');
        setTimeout( () => {
            document.dispatchEvent(new CustomEvent('boot:complete'));
        }, FADE_DURATION);
    }
    window.Boot = {start};
})();