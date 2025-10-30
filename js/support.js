// js/support.js
document.addEventListener('DOMContentLoaded', () => {
  if(window.emailjs) emailjs.init('mqnVOPu2ysfQu72il'); // public key
  const SERVICE = 'service_8pofbon';
  const TEMPLATE = 'template_o4sdsjm';

  const form = document.getElementById('supportForm');
  if(!form) return;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = form.querySelector('[name=fullname]').value.trim();
    const email = form.querySelector('[name=email]').value.trim();
    const phone = form.querySelector('[name=phone]').value.trim();
    const reason = form.querySelector('[name=reason]').value;
    const details = form.querySelector('[name=details]').value.trim();

    if(!name || !email) return alert('Name & email required.');

    const payload = {
      from_name: name,
      user_email: email,
      phone: phone,
      reason: reason,
      message: details
    };

    try{
      await emailjs.send(SERVICE, TEMPLATE, payload);
      alert('Support request sent — check your email for a reply.');
      form.reset();
    }catch(err){
      console.error(err);
      alert('Error sending support request. Try again later.');
    }
  });
});
