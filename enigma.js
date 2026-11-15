// "Reto para los padres": tres enigmas de muestra. Si te equivocas, te explica qué error has cometido,
// tal como hace el juego con los niños.
(() => {
  const box = document.getElementById('parentQuiz');
  if (!box) return;
  const Q = [
    {
      k: '3º de primaria', q: 'Un reloj analógico marca <b>las 5 menos cuarto</b>. ¿Qué hora es en formato digital?',
      ok: '16:45',
      opts: [['16:45', ''], ['17:15', 'Eso sería las cinco y cuarto. Menos cuarto significa que faltan 15 minutos para la hora: las 5 menos 15 = 4:45 (o 16:45).'], ['15:45', 'Casi: la hora es correcta (menos cuarto = :45), pero las 5 de la tarde son las 17, menos un cuarto = 16:45.'], ['17:45', 'Has sumado en vez de restar. Menos cuarto significa que faltan 15 minutos para las 5.']],
    },
    {
      k: '5º de primaria', q: '¿Qué trozo de pizza es más grande: <b>3/4</b> o <b>5/8</b>?',
      ok: '3/4',
      opts: [['5/8', 'Los números son más grandes, pero los trozos son más pequeños. Pásalo a octavos: 3/4 = 6/8, y 6/8 es más que 5/8.'], ['3/4', ''], ['Son iguales', 'Casi: 3/4 = 6/8, así que hay un octavo de diferencia.'], ['No se puede saber', '¡Sí que se puede! Se ponen las dos fracciones con el mismo denominador: 3/4 = 6/8, que es más que 5/8.']],
    },
    {
      k: '6º de primaria', q: '¿Cuánto es <b>3 + 4 × 5</b>?',
      ok: '23',
      opts: [['35', 'Has hecho las operaciones de izquierda a derecha. Primero va la multiplicación (4 × 5 = 20) y después la suma.'], ['23', ''], ['60', 'Has multiplicado los tres números. Es 3 + (4 × 5).'], ['27', '¡Casi! Revisa la multiplicación: 4 × 5 = 20.']],
    },
  ];
  let i = 0, score = 0;
  function confetti(n = 70) {
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const c = document.createElement('div');
    c.className = 'confetti' + (still ? ' still' : ''); c.setAttribute('aria-hidden', 'true');
    const cols = ['#ffd36b', '#ff8fa3', '#7ee0ff', '#5dbb63', '#c3b2ff', '#ffb547'];
    c.innerHTML = Array.from({ length: n }, (_, k) => `<i style="left:${(k * 37) % 100}%;background:${cols[k % cols.length]};animation-delay:${(k % 10) * 0.12}s;animation-duration:${2.2 + (k % 5) * 0.35}s;--x:${((k * 53) % 120) - 60}px;--r:${(k * 47) % 360}deg;--y:${(k * 29) % 90}vh"></i>`).join('');
    document.body.appendChild(c);
    setTimeout(() => c.remove(), 5000);
  }
  const shuffle = (a) => a.map((x) => [Math.random(), x]).sort((p, q) => p[0] - q[0]).map((x) => x[1]);

  function render() {
    if (i >= Q.length) {
      if (typeof window.gtag === 'function') window.gtag('event', 'reto_padres', { aciertos: score });
      const msg = score === 3 ? '¡Perfecto! Podéis ayudar con los deberes… o dejar que lo haga el búho.'
        : score === 2 ? '¡Muy bien! Un error es normal: por eso el juego explica cada error.'
        : 'Tranquilidad: aquí se aprende equivocándose. Igual que en el juego.';
      box.innerHTML = `<p class="pq-k">Resultado</p><p class="pq-score">${score} de ${Q.length}</p><p class="pq-q">${msg}</p>
        <button type="button" class="pq-again">Volver a intentarlo</button>`;
      box.querySelector('.pq-again').onclick = () => { i = 0; score = 0; render(); };
      if (score === Q.length) confetti(110);
      return;
    }
    const it = Q[i];
    box.innerHTML = `<p class="pq-k">Enigma ${i + 1} de ${Q.length} · ${it.k}</p><p class="pq-q">${it.q}</p>
      <div class="pq-opts">${shuffle(it.opts).map(([t]) => `<button type="button">${t}</button>`).join('')}</div>
      <p class="pq-fb" aria-live="polite"></p>`;
    const fb = box.querySelector('.pq-fb');
    box.querySelectorAll('.pq-opts button').forEach((b) => {
      b.onclick = () => {
        const why = it.opts.find(([t]) => t === b.textContent)[1];
        box.querySelectorAll('.pq-opts button').forEach((x) => { x.disabled = true; if (x.textContent === it.ok) x.classList.add('ok'); });
        if (!why) { score++; b.classList.add('ok'); fb.innerHTML = '<b>¡Correcto!</b>'; confetti(28); }
        else { b.classList.add('ko'); fb.innerHTML = `<b>No es eso.</b> ${why}`; }
        const n = document.createElement('button');
        n.type = 'button'; n.className = 'pq-next'; n.textContent = i < Q.length - 1 ? 'Siguiente enigma' : 'Ver el resultado';
        n.onclick = () => { i++; render(); };
        fb.after(n);
      };
    });
  }
  render();
})();
