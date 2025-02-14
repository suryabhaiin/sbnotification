class SBNotification {
    static show(message, duration = 5, showTime = true, accentColor = '#00ffff', sound = null) {
        try {
            if (!document.querySelector('#sb-notification-style')) {
                SBNotification.addStyles();
            }

            if (sound) {
                SBNotification.playSound(sound);
            }

            const container = SBNotification.getContainer();
            let existingNotification = [...container.children].find(
                (notif) => notif.querySelector('.sb-text')?.textContent === message
            );

            if (existingNotification) {
                // Move to top and restart timer
                container.prepend(existingNotification);
                SBNotification.restartNotification(existingNotification, duration);
                return;
            }
            

            const notification = SBNotification.createNotification(message, duration, showTime, accentColor);
            container.prepend(notification);
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

        const closeButton = document.createElement('button');
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
        let container = document.getElementById('sb-notification-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'sb-notification-container';
            document.body.appendChild(container);
        }
        return container;
    }

    static addStyles() {
        const style = document.createElement('style');
        style.id = 'sb-notification-style';
        style.innerHTML = `
            :root {
                --sb-bg-color: #111;
                --sb-text-color: #fff;
                --sb-accent-color: #00ffff;
            }

            #sb-notification-container {
                position: fixed;
                top: 50px;
                right: 20px;
                width: 320px;
                display: flex;
                flex-direction: column;
                align-items: flex-end;
                z-index: 1000;
                gap: 10px;
                padding-bottom: 10px;
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
                transform: translateX(100%);
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
        document.head.appendChild(style);
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
