// fade.js — applies page fade in/out transitions
window.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("fade-in");

  // Make all internal links fade out before changing pages
  document.querySelectorAll("a, button").forEach((el) => {
    el.addEventListener("click", (e) => {
      const href = el.getAttribute("href");
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
