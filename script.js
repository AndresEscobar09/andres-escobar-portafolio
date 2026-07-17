document.getElementById('year').textContent = new Date().getFullYear();

window.addEventListener('load', () => {
    const flying = document.getElementById('hero-photo-flying');
    const backdrop = document.getElementById('intro-backdrop');
    const loader = document.getElementById('loader');
    const real = document.getElementById('foto-real');
    const slot = real.parentElement; // el div col-lg-5 que contiene la foto

    // Respeta a usuarios que prefieren menos movimiento
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
        backdrop.remove();
        real.classList.add('visible');
        return;
    }

    document.body.style.overflow = 'hidden';

    // Tiempo que se muestra la foto grande + loader antes de animar (ms)
    const LOAD_TIME = 2200;

    setTimeout(() => {
        loader.classList.add('hide');

        // Medimos el lugar final, incluso si está oculto por Bootstrap (d-none en móvil)
        const wasHidden = getComputedStyle(slot).display === 'none';
        if (wasHidden) {
            slot.style.setProperty('display', 'block', 'important');
            slot.style.visibility = 'hidden';
        }
        const rect = real.getBoundingClientRect();
        if (wasHidden) {
            slot.style.removeProperty('display');
            slot.style.removeProperty('visibility');
        }

        if (wasHidden) {
            // Móvil: no hay lugar visible para la foto, se encoge y desvanece hacia arriba
            flying.style.transform = 'translate(-50%, -140%) scale(0.4)';
            flying.style.opacity = '0';
        } else {
            // Escritorio: viaja hasta su posición real en el layout
            const scale = rect.width / flying.offsetWidth;
            const deltaX = (rect.left + rect.width / 2) - window.innerWidth / 2;
            const deltaY = (rect.top + rect.height / 2) - window.innerHeight / 2;
            flying.style.transform =
                `translate(calc(-50% + ${deltaX}px), calc(-50% + ${deltaY}px)) scale(${scale})`;
            flying.classList.add('landed');
        }

        backdrop.style.opacity = '0';
        document.body.style.overflow = '';

        flying.addEventListener('transitionend', () => {
            real.classList.add('visible');
            flying.remove();
            backdrop.remove();
            loader.remove();
        }, { once: true });

    }, LOAD_TIME);
});