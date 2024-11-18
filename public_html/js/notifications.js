function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    const closeButton = document.createElement('button');
    closeButton.textContent = '×';
    closeButton.className = 'notification-close';
    closeButton.onclick = () => notification.remove();

    notification.appendChild(closeButton);
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}
