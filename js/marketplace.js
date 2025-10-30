// js/marketplace.js
document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('marketGrid');
  if(!grid) return;
  const items = odrop.getApprovedListings();
  if(items.length === 0){
    grid.innerHTML = `<div class="p-6 text-gray-500">No approved listings right now. <a href="sell.html" class="text-blue-500">List an item</a>.</div>`;
    return;
  }
  grid.innerHTML = items.map(item => `
    <article class="p-6 bg-white dark:bg-gray-800 rounded-lg fade-card" data-stagger>
      <div class="h-48 mb-4 bg-gray-100 dark:bg-gray-700 rounded overflow-hidden flex items-center justify-center">
        ${item.images && item.images[0] ? `<img src="${item.images[0].data}" style="width:100%;height:100%;object-fit:cover"/>` : `<div class="text-gray-400">No image</div>`}
      </div>
      <h3 class="text-lg font-semibold">${escapeHtml(item.title)}</h3>
      <p class="text-sm text-gray-600 dark:text-gray-300 my-3">${escapeHtml(item.description).slice(0,150)}${item.description.length>150?'…':''}</p>
      <div class="flex items-center justify-between">
        <div class="font-bold">${item.price} ${item.currency}</div>
        <button class="btn-add inline-block bg-blue-500 text-white px-3 py-1 rounded" data-id="${item.id}">Add to cart</button>
      </div>
    </article>
  `).join('');
  // attach listeners
  grid.querySelectorAll('.btn-add').forEach(btn=>{
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const item = items.find(i=>i.id===id);
      if(item){ odrop.addToCart(item); alert('Added to cart'); }
    });
  });

  // trigger stagger animation
  setTimeout(()=>document.querySelectorAll('[data-stagger]').forEach(s=>s.classList.add('animate')), 120);
});

function escapeHtml(s){ return (s+'').replace(/[&<>"']/g, c=> ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
