import 'CSS\index.css';

function component() {

function showBg(id, imageUrl) {
  document.querySelectorAll('.image-bg').forEach(bg => bg.style.opacity = '0');
  const bgElement = document.getElementById(id);
  bgElement.style.backgroundImage = imageUrl;
  bgElement.style.opacity = '1';
}

function hideBgs() {
  document.querySelectorAll('.image-bg').forEach(bg => bg.style.opacity = '0');
}
    
}

// Function to detect mobile devices
function isMobileDevice() {
    return /Mobi|Android/i.test(navigator.userAgent);
}

// Redirect mobile users
if (isMobileDevice()) {
    window.location.href = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'; // Replace with your mobile URL
}

document.body.appendChild(component());
