class SBNotification {
    static show(params = {}) {
        try {
            const {
                message = ' ',
                duration = 5,
                showTime = false,
                accentColor = '#00ffff',
                bgColor = '#111',
                textColor = '#fff',
                textAlign = 'left',
                sound = null,
                position = 'right-top',
                autoHide = true,
                combine = true,
                width = '300px'
            } = params;
            
            const container = SBNotification.getContainer(position, width);
            SBNotification.showTime = showTime;
            if(!autoHide)
            {
                SBNotification.showTime = false;
            }
            SBNotification.autoHide = autoHide;
            if (!container.shadowRoot.querySelector('#sb-notification-style')) {
                SBNotification.addStyles(container.shadowRoot);
            }

            if (sound) {
                SBNotification.playSound(sound);
            }
            if(combine)
            {
                let existingNotification = [...container.shadowRoot.children].find(
                    (notif) => notif.querySelector('.sb-text')?.textContent === message
                );
    
                if (existingNotification) {
                    container.shadowRoot.prepend(existingNotification);
                    SBNotification.restartNotification(existingNotification, duration, position);
                    return;
                }
            }
            const notification = SBNotification.createNotification(message, duration, accentColor, bgColor , textColor, textAlign, position);
            container.shadowRoot.prepend(notification);
            SBNotification.startNotification(notification, duration, position);
        } catch (error) {
            console.error('SBNotification Error:', error);
        }
    }

    static restartNotification(notification, duration, position) {
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
            if(SBNotification.autoHide)
            {
                setTimeout(() => {
                    progressBar.style.transition = `width ${duration}s linear`;
                    progressBar.style.width = '0%';
                }, 10);
    
                notification.sbTimeout = setTimeout(() => SBNotification.remove(notification, position), duration * 1000);
            }
        } catch (error) {
            console.error('Error restarting notification:', error);
        }
    }

    static createNotification(message, duration, accentColor, bgColor , textColor, textAlign, position) {
        const notification = document.createElement('div');
        notification.classList.add('sb-notification', 'sb-show');
        notification.style.setProperty('--sb-bg-color', bgColor);
        notification.style.setProperty('--sb-text-color', textColor);
        notification.style.setProperty('--sb-accent-color', accentColor);
        notification.style.setProperty('--sb-text-align', textAlign);

        const timeCounter = document.createElement('span');
        timeCounter.classList.add('sb-time-counter');
        timeCounter.textContent = duration;

        const text = document.createElement('span');
        text.classList.add('sb-text');
        text.textContent = message;

        const closeButton = document.createElement('span');
        closeButton.classList.add('sb-close');
        closeButton.innerHTML = '&times;';
        closeButton.onclick = () => SBNotification.remove(notification, position, true);

        const progressBar = document.createElement('div');
        progressBar.classList.add('sb-progress-bar');
        progressBar.style.transition = `width ${duration}s linear`;

        if (SBNotification.showTime) notification.appendChild(timeCounter);
        notification.appendChild(text);
        notification.appendChild(closeButton);
        notification.appendChild(progressBar);

        return notification;
    }

    static startNotification(notification, duration, position) {
        try {
            if(SBNotification.autoHide)
            {
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
    
                notification.sbTimeout = setTimeout(() => SBNotification.remove(notification, position), duration * 1000);
            }
        } catch (error) {
            console.error('Error starting notification:', error);
        }
    }

    static remove(notification, position, forceRemove = false) {
        try {
            if (!notification) return;

            if (forceRemove) {
                clearTimeout(notification.sbTimeout);
                clearInterval(notification.sbInterval);
            }

            
            if (position === 'right-top' || position === 'right-center') {
                notification.style.opacity = '0';
                notification.style.transform = 'translateX(100%)';
            } else if (position === 'left-top' || position === 'left-center') {
                notification.style.opacity = '0';
                notification.style.transform = 'translateX(-100%)';
            } else if (position === 'center-top' || position === 'center') {
                notification.style.opacity = '0';
                notification.style.transform = 'scale(0) 1s ease';
            }
            else
            {
                notification.style.opacity = '0';
                notification.style.transform = 'scale(0) 1s ease';
            }
            setTimeout(() => notification.remove(), 500);
        } catch (error) {
            console.error('Error removing notification:', error);
        }
    }

    static getContainer(position, width) {
        width = width || '300px';
        let shadowHost = document.getElementById('sb-notification-host-'+position);
        if (!shadowHost) {
            shadowHost = document.createElement('div');
            shadowHost.id = 'sb-notification-host-'+position;
            document.body.appendChild(shadowHost);
            shadowHost.attachShadow({ mode: 'open' });
            const hostStyles = document.createElement('style');
            if (position === 'right-top') {
                hostStyles.textContent = `
                    #sb-notification-host-right-top {
                        position: fixed;
                        top: 50px;
                        right: 20px;
                        width: `+width+`;
                        display: flex;
                        flex-direction: column;
                        align-items: flex-end;
                        z-index: 99999999999999;
                        gap: 10px;
                        max-width: 80%;
                    }
                `;
            }  else if (position === 'right-center') {
                hostStyles.textContent = `
                    #sb-notification-host-right-center {
                        position: fixed;
                        top: 50%;
                        right: 20px;
                        transform: translateY(-50%);
                        width: `+width+`;
                        display: flex;
                        flex-direction: column;
                        align-items: flex-end;
                        z-index: 99999999999999;
                        gap: 10px;
                        max-width: 80%;
                    }
                `;
            } else if (position === 'left-center') {
                hostStyles.textContent = `
                    #sb-notification-host-left-center {
                        position: fixed;
                        top: 50%;
                        left: 20px;
                        transform: translateY(-50%);
                       width: `+width+`;
                        display: flex;
                        flex-direction: column;
                        align-items: flex-start;
                        z-index: 99999999999999;
                        gap: 10px;
                        max-width: 80%;
                    }
                `;
            }
            else if (position === 'left-top') {
                hostStyles.textContent = `
                    #sb-notification-host-left-top {
                        position: fixed;
                        top: 50px;
                        left: 20px;
                        width: `+width+`;
                        display: flex;
                        flex-direction: column;
                        align-items: flex-start;
                        z-index: 99999999999999;
                        gap: 10px;
                        max-width: 80%;
                    }
                `;
            } else if (position === 'center-top') {
                hostStyles.textContent = `
                    #sb-notification-host-center-top {
                        position: fixed;
                        top: 50px;
                        left: 50%;
                        transform: translateX(-50%);
                        width:  `+width+`;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        z-index: 99999999999999;
                        gap: 10px;
                        max-width: 80%;
                    }
                `;
            } else if (position === 'center') {
                hostStyles.textContent = `
                    #sb-notification-host-center {
                        position: fixed;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        width:  `+width+`;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        z-index: 99999999999999;
                        gap: 10px;
                        max-width: 80%;
                    }
                `;
            }
            else
            {
                hostStyles.textContent = `
                    #sb-notification-host-`+position+` {
                        position: fixed;
                        top: 50px;
                        right: 20px;
                        width: `+width+`;
                        display: flex;
                        flex-direction: column;
                        align-items: flex-end;
                        z-index: 99999999999999;
                        gap: 10px;
                        max-width: 80%;
                    }
                `;
            }
            
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
                --sb-text-align: left;
            }
            .sb-notification {
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 5px 8px;
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
                max-width: 100%;
                margin-bottom: 10px;
            }

            .sb-notification.sb-show {
                transform: translateX(0);
            }

            .sb-time-counter {
                flex-shrink: 0;
                width: 28px;
                height: 28px;
                padding: 3px;
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
                text-align: var(--sb-text-align);
                margin-left: 7px;
                margin-right: 7px;
                margin-top: 15px;
                margin-bottom: 15px;
            }

            .sb-close {
                background: none;
                border: none;
                color: var(--sb-text-color);
                font-size: 18px;
                font-weight: bold;
                cursor: pointer;
                position: absolute;
                top: 0px;
                right: 7px;
                margin-left: 0;
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
            if(!SBNotification.sb_notification_flag)
            {
                SBNotification.simulateBodyClick();
            }

            if (SBNotification.audioInstance) {
                clearTimeout(SBNotification.audioTimeout);
                SBNotification.audioInstance.pause();
                SBNotification.audioInstance.currentTime = 0;
            }

            SBNotification.audioTimeout = setTimeout(() => {
                SBNotification.audioInstance = new Audio(soundFile);
                SBNotification.audioInstance.play().catch(error => console.error('Sound playback failed:', error));
            }, 500);
        } catch (error) {
            console.error('Error playing sound:', error);
        }
    }

    static simulateBodyClick() {
        if (document.body) {
            const event = new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                view: window,
            });
            document.body.dispatchEvent(event);
            SBNotification.sb_notification_flag = true;
        }
    }
}