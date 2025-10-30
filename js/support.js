// support.js
import { getAuth } from "firebase/auth";

// ✅ EmailJS credentials
const EMAILJS_SERVICE_ID = "service_8pofbon";
const EMAILJS_TEMPLATE_SUPPORT_ID = "template_o4sdsjm";
const EMAILJS_PUBLIC_KEY = "mqnVOPu2ysfQu72il";

document.addEventListener("DOMContentLoaded", () => {
  const supportForm = document.getElementById("supportForm");

  if (!supportForm) return;

  supportForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const auth = getAuth();
    const user = auth.currentUser;

    const name = document.getElementById("supportName").value;
    const email = document.getElementById("supportEmail").value;
    const phone = document.getElementById("supportPhone").value;
    const reason = document.getElementById("supportReason").value;
    const message = document.getElementById("supportMessage").value;

    try {
      const emailData = {
        from_name: name,
        from_email: email,
        phone_number: phone || "Not provided",
        reason_for_help: reason,
        message,
        user_email: user ? user.email : "Guest",
      };

      // ✅ Send support email
      const response = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_SUPPORT_ID,
        emailData,
        EMAILJS_PUBLIC_KEY
      );

      console.log("Support email sent:", response);
      alert("Your support request has been sent!");
      supportForm.reset();
    } catch (error) {
      console.error("Error sending support email:", error);
      alert("Error submitting support request. Please try again.");
    }
  });
});
