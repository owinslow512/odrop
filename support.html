<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Support — Odrop</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script> tailwind.config = { darkMode: 'class' } </script>
</head>
<body class="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
  <nav class="bg-gray-900 text-white p-4 flex justify-between items-center">
    <div class="text-2xl font-bold cursor-pointer" onclick="goHome()">Odrop</div>
    <div class="flex items-center space-x-6">
      <button onclick="goMarketplace()">Marketplace</button>
      <button onclick="goSell()">Sell</button>
      <button onclick="goProfile()">Profile</button>
      <button onclick="goSettings()">Settings</button>
      <button id="themeBtn" class="text-xl"></button>
    </div>
  </nav>

  <main class="max-w-2xl mx-auto p-6">
    <h1 class="text-3xl font-bold mb-4">Support</h1>
    <form id="supportForm" class="bg-white dark:bg-gray-800 p-6 rounded shadow">
      <label class="block mb-2">Full name</label>
      <input id="sup_name" class="w-full p-2 rounded border dark:bg-gray-700 mb-3" />

      <label class="block mb-2">Email</label>
      <input id="sup_email" type="email" class="w-full p-2 rounded border dark:bg-gray-700 mb-3" />

      <label class="block mb-2">Phone (optional)</label>
      <input id="sup_phone" class="w-full p-2 rounded border dark:bg-gray-700 mb-3" />

      <label class="block mb-2">Reason</label>
      <select id="sup_reason" class="w-full p-2 rounded border dark:bg-gray-700 mb-3">
        <option>Scam</option>
        <option>Account Issue</option>
        <option>Bug Report</option>
        <option>Feedback</option>
        <option>Other</option>
      </select>

      <label class="block mb-2">Message</label>
      <textarea id="sup_msg" class="w-full p-2 rounded border dark:bg-gray-700 mb-3"></textarea>

      <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded">Send Support Request</button>
    </form>

    <p id="supportStatus" class="mt-3 text-sm"></p>
  </main>

  <script src="main.js"></script>
  <script>
    odrop.initThemeButton("themeBtn");
    document.getElementById("supportForm").addEventListener("submit", async (e) => {
      e.preventDefault();
      const name = document.getElementById("sup_name").value.trim();
      const email = document.getElementById("sup_email").value.trim();
      const phone = document.getElementById("sup_phone").value.trim();
      const reason = document.getElementById("sup_reason").value;
      const message = document.getElementById("sup_msg").value.trim();
      if(!name || !email || !message){ alert("Please enter name, email and message."); return; }
      document.getElementById("supportStatus").textContent = "Sending...";
      const res = await odrop.submitSupport({name,email,phone,reason,message});
      document.getElementById("supportStatus").textContent = res.ok ? "Support request sent!" : "Saved locally (email not configured).";
      document.getElementById("supportForm").reset();
    });
  </script>
</body>
</html>
