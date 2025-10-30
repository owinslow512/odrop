// sell.js
import { getAuth } from "firebase/auth";

// EmailJS credentials
const EMAILJS_SERVICE_ID = "service_8pofbon";
const EMAILJS_TEMPLATE_LISTING_ID = "template_ed7sx4o";
const EMAILJS_PUBLIC_KEY = "mqnVOPu2ysfQu72il";

document.addEventListener("DOMContentLoaded", () => {
    const sellForm = document.getElementById("sellForm");
    if (!sellForm) return;

    sellForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const auth = getAuth();
        const user = auth.currentUser;

        const title = document.getElementById("listingTitle").value.trim();
        const description = document.getElementById("listingDescription").value.trim();
        const price = document.getElementById("listingPrice").value.trim();
        const crypto = document.getElementById("listingCrypto").value.trim();

        // Validation
        if (!user) {
            alert("You must be signed in to create a listing.");
            return;
        }
        if (title.length < 10) {
            alert("Title must be at least 10 characters long.");
            return;
        }
        if (description.length < 20) {
            alert("Description must be at least 20 characters long.");
            return;
        }
        if (!price || isNaN(price)) {
            alert("Please enter a valid price.");
            return;
        }

        // Build email payload
        const emailData = {
            from_name: user.email,
            listing_title: title,
            listing_description: description,
            listing_price: price,
            listing_crypto: crypto,
            reply_to: user.email,
        };

        try {
            const response = await emailjs.send(
                EMAILJS_SERVICE_ID,
                EMAILJS_TEMPLATE_LISTING_ID,
                emailData,
                EMAILJS_PUBLIC_KEY
            );
            console.log("Listing review email sent:", response);
            alert("✅ Your listing has been submitted for review!");
            sellForm.reset();
        } catch (error) {
            console.error("Error sending listing email:", error);
            alert("❌ There was an error submitting your listing. Please try again.");
        }
    });
});
