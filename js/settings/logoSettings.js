import { setLogoStyle } from '../../assets/theme/logoEngine.js';

export function initLogoSettings() {
  const radios = document.querySelectorAll('input[name="logoStyle"]');
  if (!radios.length) return;

  radios.forEach(radio => {
    radio.addEventListener('change', e => {
      setLogoStyle(e.target.value);
    });
  });

  const saved = localStorage.getItem("selectedLogo");
  if (saved !== null) {
    const match = document.querySelector(`input[name="logoStyle"][value="${saved}"]`);
    if (match) match.checked = true;
  }
}
