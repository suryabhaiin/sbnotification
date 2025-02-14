class SBNotification {
    static show(params = {}) {
        try {
            const {
                message,
                duration = 5,
                showTime = true,
                accentColor = '#00ffff',
                sound = null
            } = params;
            
            const container = SBNotification.getContainer();
            if (!container.shadowRoot.querySelector('#sb-notification-style')) {
                SBNotification.addStyles(container.shadowRoot);
            }

            if (sound) {
                SBNotification.playSound(sound);
            }

            let existingNotification = [...container.shadowRoot.children].find(
                (notif) => notif.querySelector('.sb-text')?.textContent === message
            );

            if (existingNotification) {
                // Move to top and restart timer
                container.shadowRoot.prepend(existingNotification);
                SBNotification.restartNotification(existingNotification, duration);
                return;
            }

            const notification = SBNotification.createNotification(message, duration, showTime, accentColor);
            container.shadowRoot.prepend(notification);
            SBNotification.startNotification(notification, duration);
        } catch (error) {
            console.error('SBNotification Error:', error);
        }
    }

    static restartNotification(notification, duration) {
        try {
            const progressBar = notification.querySelector('.sb-progress-bar');
            const timeCounter = notification.querySelector('.sb-time-counter');

            clearTimeout(notification.sbTimeout);
            clearInterval(notification.sbInterval);

            let timeLeft = duration;
            if (timeCounter) timeCounter.textContent = timeLeft;

            notification.sbInterval = setInterval(() => {
                if (timeLeft > 0) {
                    timeLeft -= 1;
                    if (timeCounter) timeCounter.textContent = timeLeft;
                } else {
                    clearInterval(notification.sbInterval);
                }
            }, 1000);

            progressBar.style.transition = 'none';
            progressBar.style.width = '100%';
            setTimeout(() => {
                progressBar.style.transition = `width ${duration}s linear`;
                progressBar.style.width = '0%';
            }, 10);

            notification.sbTimeout = setTimeout(() => SBNotification.remove(notification), duration * 1000);
        } catch (error) {
            console.error('Error restarting notification:', error);
        }
    }

    static createNotification(message, duration, showTime, accentColor) {
        const notification = document.createElement('div');
        notification.classList.add('sb-notification', 'sb-show');
        notification.style.setProperty('--sb-accent-color', accentColor);

        const timeCounter = document.createElement('span');
        timeCounter.classList.add('sb-time-counter');
        timeCounter.textContent = duration;

        const text = document.createElement('span');
        text.classList.add('sb-text');
        text.textContent = message;

        const closeButton = document.createElement('span');
        closeButton.classList.add('sb-close');
        closeButton.innerHTML = '&times;';
        closeButton.onclick = () => SBNotification.remove(notification, true);

        const progressBar = document.createElement('div');
        progressBar.classList.add('sb-progress-bar');
        progressBar.style.transition = `width ${duration}s linear`;

        if (showTime) notification.appendChild(timeCounter);
        notification.appendChild(text);
        notification.appendChild(closeButton);
        notification.appendChild(progressBar);

        return notification;
    }

    static startNotification(notification, duration) {
        try {
            setTimeout(() => {
                const progressBar = notification.querySelector('.sb-progress-bar');
                if (progressBar) progressBar.style.width = '0%';
            }, 10);

            let timeLeft = duration;
            notification.sbInterval = setInterval(() => {
                if (timeLeft > 0) {
                    timeLeft -= 1;
                    const timeCounter = notification.querySelector('.sb-time-counter');
                    if (timeCounter) timeCounter.textContent = timeLeft;
                } else {
                    clearInterval(notification.sbInterval);
                }
            }, 1000);

            notification.sbTimeout = setTimeout(() => SBNotification.remove(notification), duration * 1000);
        } catch (error) {
            console.error('Error starting notification:', error);
        }
    }

    static remove(notification, forceRemove = false) {
        try {
            if (!notification) return;

            if (forceRemove) {
                clearTimeout(notification.sbTimeout);
                clearInterval(notification.sbInterval);
            }

            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 500);
        } catch (error) {
            console.error('Error removing notification:', error);
        }
    }

    static getContainer() {
        let shadowHost = document.getElementById('sb-notification-host');
        if (!shadowHost) {
            shadowHost = document.createElement('div');
            shadowHost.id = 'sb-notification-host';
            document.body.appendChild(shadowHost);
            shadowHost.attachShadow({ mode: 'open' });

            // Add styles to position the host at the top-right corner
            const hostStyles = document.createElement('style');
            hostStyles.textContent = `
                #sb-notification-host {
                    position: fixed;
                    top: 20px; /* Adjusted to top of the page */
                    right: 20px; /* Adjusted to right of the page */
                    width: 320px;
                    display: flex;
                    flex-direction: column;
                    align-items: flex-end;
                    z-index: 1000;
                    gap: 10px;
                }
            `;
            document.head.appendChild(hostStyles);
        }

        return shadowHost;
    }

    static addStyles(shadowRoot) {
        const style = document.createElement('style');
        style.id = 'sb-notification-style';
        style.innerHTML = `
            :host {
                --sb-bg-color: #111;
                --sb-text-color: #fff;
                --sb-accent-color: #00ffff;
            }

            #sb-notification-container {
                position: fixed;
                top: 20px; /* Adjusted to top of the page */
                right: 20px; /* Adjusted to right of the page */
                width: 320px;
                display: flex;
                flex-direction: column;
                align-items: flex-end;
                z-index: 1000;
                gap: 10px;
            }

            .sb-notification {
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 12px;
                width: 100%;
                min-height: 50px;
                background: var(--sb-bg-color);
                color: var(--sb-text-color);
                border-left: 4px solid var(--sb-accent-color);
                border-radius: 8px;
                box-shadow: 0 0 10px var(--sb-accent-color);
                opacity: 1;
                transform: translateX(0);
                transition: opacity 0.5s, transform 0.5s;
                position: relative;
                overflow: hidden;
            }

            .sb-notification.sb-show {
                transform: translateX(0);
            }

            .sb-time-counter {
                flex-shrink: 0;
                width: 28px;
                height: 28px;
                display: flex;
                align-items: center;
                justify-content: center;
                border: 2px solid var(--sb-accent-color);
                border-radius: 50%;
                font-size: 14px;
                font-weight: bold;
                box-shadow: 0 0 10px var(--sb-accent-color);
            }

            .sb-text {
                flex-grow: 1;
                text-align: left;
            }

            .sb-close {
                background: none;
                border: none;
                color: var(--sb-text-color);
                font-size: 18px;
                font-weight: bold;
                cursor: pointer;
                margin-left: auto;
            }

            .sb-close:hover {
                color: var(--sb-accent-color);
            }

            .sb-progress-bar {
                position: absolute;
                bottom: 0;
                left: 0;
                height: 4px;
                background: var(--sb-accent-color);
                width: 100%;
                transition: width linear;
            }
        `;
        shadowRoot.appendChild(style);
    }

    static playSound(soundFile) {
        try {
            if (!soundFile) return;

            if (SBNotification.audioInstance) {
                clearTimeout(SBNotification.audioTimeout);
                SBNotification.audioInstance.pause();
                SBNotification.audioInstance.currentTime = 0;
            }

            SBNotification.audioTimeout = setTimeout(() => {
                SBNotification.audioInstance = new Audio(soundFile);
                SBNotification.audioInstance.play().catch(error => console.error('Sound playback failed:', error));
            }, 300);
        } catch (error) {
            console.error('Error playing sound:', error);
        }
    }
}
