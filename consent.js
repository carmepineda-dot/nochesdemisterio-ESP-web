// Analítica (Google Analytics 4) solo con consentimiento previo.
// Sin respuesta o con "Rechazar", no se carga nada de Google ni se pone ninguna cookie.
(() => {
  const GA_ID = 'G-NRDSFFLH9T';
  const KEY = 'ndm-cookies'; // 'si' | 'no'
  const ready = /^G-[A-Z0-9]{6,}$/.test(GA_ID) && GA_ID !== 'G-XXXXXXXXXX';

  const get = () => { try { return localStorage.getItem(KEY); } catch (e) { return null; } };
  const set = (v) => { try { localStorage.setItem(KEY, v); } catch (e) { /* sin almacenamiento */ } };

  function loadGA() {
    if (!ready || window.__gaLoaded) return;
    window.__gaLoaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', GA_ID);
    const s = document.createElement('script');
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    document.head.appendChild(s);
  }

  function clearGA() {
    for (const c of document.cookie.split(';')) {
      const name = c.split('=')[0].trim();
      if (/^_ga/.test(name)) {
        for (const d of ['', `; domain=${location.hostname}`, `; domain=.${location.hostname}`]) document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${d}`;
      }
    }
  }

  function banner() {
    if (!ready || document.getElementById('cookieBox')) return;
    const box = document.createElement('div');
    box.id = 'cookieBox';
    box.className = 'cookie';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-label', 'Cookies');
    box.innerHTML = `<p>Usamos cookies de analítica (Google Analytics) para saber cuántas personas visitan la web y mejorarla. Solo se activan si las aceptas. <a href="/cookies/">Más información</a></p>
      <div class="cookie-btns"><button type="button" data-c="no">Rechazar</button><button type="button" data-c="si">Aceptar</button></div>`;
    box.addEventListener('click', (e) => {
      const v = e.target.closest('button')?.dataset.c;
      if (!v) return;
      set(v);
      box.remove();
      if (v === 'si') loadGA();
      else { clearGA(); if (window.__gaLoaded) location.reload(); }
    });
    document.body.appendChild(box);
  }

  window.ndmCookies = () => { document.getElementById('cookieBox')?.remove(); banner(); };

  const v = get();
  if (v === 'si') loadGA();
  else if (v !== 'no') (document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', banner) : banner());
})();
