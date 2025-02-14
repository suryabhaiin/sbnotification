# SBNotification

SBNotification is a simple JavaScript notification library with sound and accent color support.

## 🚀 Features

- Customizable notifications with text, duration, sound, and accent color.
- Optional countdown timer display.
- Lightweight and easy to integrate.

## 📥 Installation

Include the script in your project:

```html
<script src="https://cdn.jsdelivr.net/gh/suryabhaiin/sbnotification@main/sb-notification.js"></script>
```

## ⚡ Usage

Call the `SBNotification.show()` function to display a notification:

```javascript
SBNotification.show({
    message: 'Notification Text',
    duration: 5, // Optional, default: 5
    showTime: true, // Optional, default: true
    accentColor: '#00ffff', // Optional, default: '#00ffff'
    sound: null // Optional, default: null
});
```

## 📌 Parameters

- `message` (Required) - The text to display in the notification.
- `duration`  (Optional) - Time (in seconds) before the notification disappears. Default: 5.
- `showTime` (Optional) - Show countdown timer? Default: true.
- `accentColor`  (Optional) - Border and glow color. Default: "#00ffff".
- `sound` (Optional) - Path to the sound file. Default: null.

## 🔧 Examples

### Default Notification

```javascript
SBNotification.show({
    message: 'Default = This is a default notification'
});
```

### Custom Notification with Sound

```javascript
SBNotification.show({
    message: 'Custom = This is a custom notification',
    duration: 10,
    showTime: true,
    accentColor: '#ff0000',
    sound: 'success.wav'
});
```

### Notification Without Timer

```javascript
SBNotification.show({
    message: 'No Timer = No timer counter notification',
    duration: 10,
    showTime: false,
    accentColor: '#00ff00',
    sound: 'error.wav'
});
```
## 📸 Screenshot
![SBNotification Screenshot](Screenshot.png)


## 🎉 License

This project is licensed under the MIT License.

---

### 📌 Contribution

Feel free to submit issues or pull requests to improve SBNotification!

Happy coding! 🚀
