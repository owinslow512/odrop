// js/sell.js
// Requires: emailjs (CDN), main.js (odrop)
document.addEventListener('DOMContentLoaded', () => {
  if(typeof emailjs === 'undefined') {
    console.warn('EmailJS not loaded. Listing review email will fail.');
  }
  const EMAILJS_SERVICE_ID = "service_8pofbon";
  const EMAILJS_TEMPLATE_LISTING_ID = "template_ed7sx4o";
  const EMAILJS_PUBLIC_KEY = "mqnVOPu2ysfQu72il";

  // init emailjs if available
  if(window.emailjs) emailjs.init(EMAILJS_PUBLIC_KEY);

  const form = document.getElementById('sellForm');
  if(!form) return;

  // image inputs
  const fileInput = document.getElementById('listingImages');
  const previewArea = document.getElementById('imagePreview');

  fileInput && fileInput.addEventListener('change', (ev) => {
    previewArea.innerHTML = '';
    const files = Array.from(ev.target.files).slice(0,6);
    files.forEach(file => {
      const reader = new FileReader();
      const el = document.createElement('div');
      el.className = 'w-32 h-20 rounded overflow-hidden border';
      el.innerHTML = '<div class="skeleton w-full h-full"></div>';
      previewArea.appendChild(el);
      reader.onload = (e) => {
        el.innerHTML = `<img src="${e.target.result}" style="width:100%;height:100%;object-fit:cover">`;
      };
      reader.readAsDataURL(file);
    });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = form.querySelector('[name=title]').value.trim();
    const desc = form.querySelector('[name=description]').value.trim();
    const price = form.querySelector('[name=price]').value.trim();
    const crypto = form.querySelector('[name=crypto]').value;

    if(title.length < 3) return alert('Title too short');
    if(desc.length < 50) return alert('Description must be at least 50 characters.');
    if(!price || isNaN(price)) return alert('Enter a numeric price.');

    // read images
    const images = [];
    const files = Array.from(fileInput.files || []);
    for(let f of files.slice(0,6)){
      const b64 = await toBase64(f);
      images.push({name: f.name, data: b64});
    }

    const listing = {
      id: odrop.uid('listing'),
      title, description: desc, price, currency: crypto, images,
      approved: false, created_at: Date.now()
    };
    // save locally
    odrop.addListing(listing);

    // send review email (so you can approve)
    if(window.emailjs){
      try{
        const emailData = {
          from_name: 'Odrop Listing',
          listing_title: title,
          listing_description: desc,
          listing_price: price,
          listing_crypto: crypto,
          reply_to: 'noreply@odrop',
          listing_id: listing.id,
          listing_preview: images[0] ? images[0].data : ''
        };
        await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_LISTING_ID, emailData, EMAILJS_PUBLIC_KEY);
        alert('Listing submitted for review — emailed to admin.');
        form.reset(); previewArea.innerHTML = '';
      }catch(err){
        console.error(err);
        alert('Listing saved, but failed to send review email. Check console.');
      }
    } else {
      alert('Listing saved locally. EmailJS not loaded.');
      form.reset(); previewArea.innerHTML = '';
    }
  });

  function toBase64(file){ return new Promise((res,rej)=>{
    const r = new FileReader();
    r.onload = ()=> res(r.result);
    r.onerror = ()=> rej();
    r.readAsDataURL(file);
  }); }
});
