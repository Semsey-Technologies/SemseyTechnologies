import { setCogStyle } from '../../assets/theme/cogEngine.js';

export function initCogSettings() {
  const radios = document.querySelectorAll('input[name="cogStyle"]');
  if (!radios.length) return;

  radios.forEach(radio => {
    radio.addEventListener('change', e => {
      setCogStyle(e.target.value);
    });
  });
}
