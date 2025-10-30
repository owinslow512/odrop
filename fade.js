// fade.js — global fade in/out transitions for all pages
window.addEventListener("DOMContentLoaded", () => {
  // Fade in when page loads
  document.body.classList.add("fade-in");

  // Add fade-out before navigation
  document.querySelectorAll("a, button").forEach((el) => {
    el.addEventListener("click", (e) => {
      const href = el.getAttribute("href");

      // Skip anchors, mailto, JS-only buttons
      if (href && !href.startsWith("#") && !href.startsWith("mailto:") && !href.startsWith("javascript:")) {
        e.preventDefault();
        document.body.classList.add("fade-out");
        setTimeout(() => {
          window.location.href = href;
        }, 400);
      }
    });
  });
});
