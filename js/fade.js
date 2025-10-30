// fade.js

// Fade-in when page loads
window.addEventListener("load", () => {
  document.body.classList.add("fade-in");
});

// Fade-out before navigating away
function navigateWithFade(url) {
  document.body.classList.remove("fade-in");
  document.body.classList.add("fade-out");
  setTimeout(() => {
    window.location.href = url;
  }, 400); // matches the CSS transition
}

// Optional: Intercept link clicks automatically
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("a[href]").forEach(link => {
    const url = link.getAttribute("href");
    if (!url.startsWith("#") && !url.startsWith("javascript:")) {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        navigateWithFade(url);
      });
    }
  });
});
