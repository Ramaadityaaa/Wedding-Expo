// Popup.js - small util to show a simple modal popup (DOM-based, like your original)
export default function showPopup(message) {
  const modal = document.createElement('div');
  modal.style = "position:fixed;inset:0;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;z-index:99999;";
  modal.innerHTML = `<div style='background:white;padding:20px;border-radius:12px;max-width:300px;text-align:center;font-family:sans-serif;'>
      <p>${message}</p>
      <button id='popupCloseBtn' style='margin-top:12px;padding:6px 16px;border-radius:8px;background:#ffb200;color:white;'>OK</button>
  </div>`;
  document.body.appendChild(modal);
  modal.querySelector('#popupCloseBtn').onclick = () => modal.remove();
}
