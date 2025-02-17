# SBNotification

SBNotification is a simple JavaScript notification library with sound and accent color support.

For detailed documentation, visit the [SBNotification Documentation](https://sbnotify.suryabhai.in).

## 🚀 Features

- Customizable notifications with text, duration, sound, and accent color.
- Optional countdown timer display.
- Lightweight and easy to integrate.


## 📥 Installation

Include the script in your project:

```html
<script src="sb-notification.js"></script>
```

OR:

```html
<script src="sb-notification.min.js"></script>
```

## ⚡ Usage

Call the `SBNotification.show()` function to display a notification:

```javascript
SBNotification.show({
    message: 'Notification Text',
    duration: 5, // Optional, default: 5
    showTime: false, // Optional, default: true
    accentColor: '#00ffff', // Optional, default: '#00ffff'
    bgColor: '#111', // Optional
    textColor: '#fff', // Optional
    sound: null, // Optional, default: null
    position: 'right-top', // Optional
    autoHide: true, // Optional, default: true
    combine: true, // Optional, default: true
    width = '300px' // Optional, default: 300px
});

            
```

## 📌 Parameters

| Parameter      | Description                                                                 | Default Value   | Available Options                                                                 |
|----------------|-----------------------------------------------------------------------------|-----------------|-----------------------------------------------------------------------------------|
| `message`      | The text to display in the notification.                                    | **Required**    | Format: `"Text"`                                                                  |
| `duration`     | Time (in seconds) before the notification disappears.                       | `5`             | Any positive number (e.g., `10` for 10 seconds).                                  |
| `showTime`     | Show a countdown timer in the notification.                                 | `false`         | `true` / `false`                                                                  |
| `accentColor`  | Border and glow color of the notification.                                  | `#00ffff`       | Any valid CSS color (e.g., `#ff0000`, `rgb(255, 0, 0)`, `blue`).                  |
| `bgColor`      | Background color of the notification.                                       | `#111`          | Any valid CSS color.                                                              |
| `textColor`    | Text color of the notification.                                             | `#fff`          | Any valid CSS color.                                                              |
| `sound`        | Path to a sound file to play when the notification appears.                 | `null`          | Path to a sound file (e.g., `success.wav`). `null` means no sound.                |
| `position`     | Position of the notification on the screen.                                 | `right-top`     | `right-top`, `right-center`, `left-top`, `left-center`, `center-top`, `center`.   |
| `autoHide`     | Whether the notification should automatically hide after the duration.      | `true`          | `true` / `false`                                                                  |
| `width`        | Width of the notification.                                                  | `300px`         | Any valid CSS width value (e.g., `400px`, `50%`, `auto`).                         |

## 🔧 Examples

### Default Notification
```javascript
SBNotification.show({
    message: 'This is a default notification'
});
```

### Custom Notification with Sound

```javascript
SBNotification.show({
    message: 'Custom notification with sound',
    duration: 10,
    accentColor: '#ff0000',
    sound: 'success.wav'
});
```

### Notification with Timer and Sound

```javascript
SBNotification.show({
    message: 'Notification with timer and sound',
    duration: 15,
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

### Notification with Auto-Hide Disabled

```javascript
SBNotification.show({
    message: 'Auto-Hide Disabled',
    autoHide: false,
    duration: 10
});
```
### Notification with Combine Disabled

```javascript
SBNotification.show({
    message: 'Combine Disabled',
    combine: false,
    duration: 10
});
```

### Notification with Custom Width

```javascript
SBNotification.show({
    message: 'Custom Width Notification',
    width: '400px',
    duration: 10
});
```

### Notification with Custom Position (Right Top)

```javascript
SBNotification.show({
    message: 'Right Top Notification',
    position: 'right-top',
    accentColor: '#00ff00'
});
```

### Notification with Custom Position (Right Center)

```javascript
SBNotification.show({
    message: 'Right Center Notification',
    position: 'right-center',
    accentColor: '#00ff00'
});
```

### Notification with Custom Position (Left Top)

```javascript
SBNotification.show({
    message: 'Left Top Notification',
    position: 'left-top',
    accentColor: '#00ff00'
});
```

### Notification with Custom Position (Left Center)

```javascript
SBNotification.show({
    message: 'Left Center Notification',
    position: 'left-center',
    accentColor: '#00ff00'
});
```

### Notification with Custom Position (Center Top)

```javascript
SBNotification.show({
    message: 'Center Top Notification',
    position: 'center-top',
    accentColor: '#00ff00'
});
```

### Notification with Custom Position (Center)

```javascript
SBNotification.show({
    message: 'Center Notification',
    position: 'center',
    accentColor: '#00ff00'
});
```

### Notification with All Custom Options

```javascript
SBNotification.show({
    message: 'Fully Custom Notification',
    duration: 15,
    showTime: true,
    accentColor: '#ff0077',
    bgColor: '#222',
    textColor: '#fff',
    sound: 'alert.wav',
    position: 'center',
    autoHide: true,
    combine: false,
    width: '500px'
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
