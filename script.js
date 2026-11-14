document.addEventListener('DOMContentLoaded', function() {
    const petalsContainer = document.getElementById('petals-container');
    const celebrateBtn = document.getElementById('celebrate-btn');
    const welcomeScreen = document.getElementById('welcome-screen');
    const cardScreen = document.getElementById('card-screen');
    const kitty = document.getElementById('kitty');
    const welcomeText = document.getElementById('welcome-text');
    const secondLine = document.getElementById('second-line');
    const bubble = document.querySelector('.thought-bubble');
    const topBtns = document.getElementById('top-btns');
    const videoBtn = document.getElementById('video-btn');
    const videoOverlay = document.getElementById('video-overlay');
    const videoClose = document.getElementById('video-close');
    const birthdayVideo = document.getElementById('birthday-video');
    
    const petals = ['🌸', '🌺', '🌷', '🌹', '💐', '🌻', '🌼'];
    
    const TULIP_COLORS = ['#e91e63', '#f44336', '#ff9800', '#ffeb3b', '#9c27b0', '#e91e63', '#ff5722', '#03a9f4', '#7c4dff'];

    function lilyHTML() {
        return '<span class="stem"></span>' +
            '<span class="leaf left"></span>' +
            '<span class="leaf right"></span>' +
            '<span class="bloom"><span class="lily-petal"></span><span class="lily-petal"></span>' +
            '<span class="lily-petal"></span><span class="lily-petal"></span>' +
            '<span class="lily-petal"></span><span class="lily-petal"></span>' +
            '<span class="stamen"></span><span class="stamen"></span><span class="stamen"></span></span>';
    }
    
    function tulipHTML() {
        return '<span class="stem"></span>' +
            '<span class="leaf left"></span>' +
            '<span class="tulip-bloom"><span class="tulip-petal"></span>' +
            '<span class="tulip-petal"></span><span class="tulip-petal"></span></span>';
    }
    
    function createField() {
        const field = document.getElementById('field');
        field.classList.remove('hidden');
        field.classList.remove('night');
        field.innerHTML = '';

        // Sol clicable (día)
        const sunEl = document.createElement('div');
        sunEl.className = 'sun-el';
        sunEl.title = 'Haz clic para ver la luna';
        field.appendChild(sunEl);

        // Luna clicable (noche)
        const moonEl = document.createElement('div');
        moonEl.className = 'moon-el';
        moonEl.title = 'Haz clic para volver al día';
        field.appendChild(moonEl);

        // Cielo estrellado (visible de noche)
        for (let i = 0; i < 55; i++) {
            const st = document.createElement('div');
            st.className = 'star-el';
            st.style.left = Math.random() * 100 + '%';
            st.style.top = Math.random() * 30 + '%';
            const size = 2 + Math.random() * 4;
            st.style.width = size + 'px';
            st.style.height = size + 'px';
            st.style.animationDelay = (Math.random() * 3) + 's';
            st.style.animationDuration = (2.2 + Math.random() * 2.5) + 's';
            field.appendChild(st);
        }

        sunEl.addEventListener('click', function() {
            field.classList.add('night');
        });
        moonEl.addEventListener('click', function() {
            field.classList.remove('night');
        });
        
        // Filas que se alejan hacia el horizonte (efecto de infinito)
        const rows = [
            { bottom: 1,  scale: 1.4,  count: 3, z: 6 },
            { bottom: 10, scale: 1.22, count: 3, z: 5 },
            { bottom: 19, scale: 1.05, count: 4, z: 4 },
            { bottom: 28, scale: 0.88, count: 4, z: 3 },
            { bottom: 37, scale: 0.72, count: 5, z: 2 },
            { bottom: 46, scale: 0.58, count: 6, z: 1 },
            { bottom: 54, scale: 0.46, count: 8, z: 1 }
        ];
        
        rows.forEach((row, ri) => {
            // Lirios en la mitad izquierda
            for (let i = 0; i < row.count; i++) {
                const left = ((i + 0.5) * (50 / row.count)) + (Math.random() * 4 - 2);
                addFlower(field, 'lily', lilyHTML(), row, ri, left);
            }
            // Tulipanes en la mitad derecha
            for (let i = 0; i < row.count; i++) {
                const left = 50 + ((i + 0.5) * (50 / row.count)) + (Math.random() * 4 - 2);
                addFlower(field, 'tulip', tulipHTML(), row, ri, left);
            }
        });
    }
    
    function addFlower(field, type, html, row, ri, left) {
        const flower = document.createElement('div');
        flower.className = type + ' growing';
        flower.style.left = left + '%';
        flower.style.bottom = (row.bottom + Math.random() * 2) + '%';
        flower.style.height = ((170 - ri * 24) + Math.random() * 30) + 'px';
        flower.style.zIndex = row.z;
        flower.style.setProperty('--s', (row.scale * (0.94 + Math.random() * 0.12)).toFixed(2));
        flower.style.opacity = (1 - ri * 0.13).toFixed(2);
        flower.innerHTML = html;
        
        if (type === 'tulip') {
            const color = TULIP_COLORS[Math.floor(Math.random() * TULIP_COLORS.length)];
            flower.style.setProperty('--tc', color);
            flower.style.setProperty('--tc-light', (color === '#ffeb3b' || color === '#03a9f4') ? '#ffffff' : '#ff8fab');
        }
        
        flower.addEventListener('click', function(e) {
            e.stopPropagation();
            flowerPetalBurst(flower, type);
            const oldOp = flower.style.opacity;
            flower.classList.remove('growing');
            flower.classList.add('popped');
            setTimeout(() => {
                flower.remove();
                addFlower(field, type, type === 'lily' ? lilyHTML() : tulipHTML(), row, ri, left);
                const fresh = field.lastChild;
                fresh.style.transition = 'none';
                fresh.style.opacity = '0';
                requestAnimationFrame(() => {
                    fresh.style.transition = 'opacity 0.6s ease-out';
                    fresh.style.opacity = oldOp;
                });
            }, 560);
        });
        
        field.appendChild(flower);
    }
    
    function flowerPetalBurst(elm, type) {
        const r = elm.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2 - 10;
        const color = type === 'tulip'
            ? (elm.style.getPropertyValue('--tc') || '#e91e63')
            : '#ffffff';
        for (let i = 0; i < 10; i++) {
            const p = document.createElement('span');
            const ang = (Math.PI * 2 / 10) * i + Math.random() * 0.7;
            const dist = 50 + Math.random() * 60;
            p.className = 'petal-burst';
            p.style.background = color;
            p.style.left = cx + 'px';
            p.style.top = cy + 'px';
            p.style.setProperty('--dx', (Math.cos(ang) * dist) + 'px');
            p.style.setProperty('--dy', (Math.sin(ang) * dist - 30) + 'px');
            p.style.setProperty('--rot', (Math.random() * 720 - 360) + 'deg');
            document.body.appendChild(p);
            setTimeout(() => p.remove(), 1000);
        }
    }
    
    function createPetals() {
        for (let i = 0; i < 30; i++) {
            setTimeout(() => {
                const petal = document.createElement('div');
                petal.className = 'petal';
                petal.textContent = petals[Math.floor(Math.random() * petals.length)];
                petal.style.left = Math.random() * 100 + 'vw';
                petal.style.animationDuration = (Math.random() * 3 + 3) + 's';
                
                petalsContainer.appendChild(petal);
                
                setTimeout(() => {
                    petal.remove();
                }, 6000);
            }, i * 100);
        }
    }
    
    function typeWriter(element, text, speed, callback) {
        element.innerHTML = '';
        let index = 0;
        
        function type() {
            if (index < text.length) {
                element.innerHTML = text.substring(0, index + 1);
                index++;
                setTimeout(type, speed);
            } else {
                if (callback) callback();
            }
        }
        
        type();
    }
    
    function shakeKitty() {
        kitty.classList.remove('bounce');
        void kitty.offsetWidth;
        kitty.classList.add('bounce');
    }
    
    function showCard(onDone) {
        // Ocultar pantalla 1
        welcomeScreen.classList.add('hidden');
        
        // Mostrar el campo de lirios
        createField();
        
        // Mostrar pantalla 2
        cardScreen.classList.remove('hidden');
        
        const alreadyShown = sessionStorage.getItem('cardShown') === 'true';
        const message = document.querySelector('.message');
        
        // Si ya se mostró la animación una vez, dejar el texto listo al instante
        if (message && !alreadyShown) {
            const paragraphs = message.querySelectorAll('p');
            const texts = Array.from(paragraphs).map(p => p.textContent);
            paragraphs.forEach(p => { p.style.opacity = '0'; });
            let paragraphIndex = 0;
            
            function writeParagraph() {
                if (paragraphIndex >= paragraphs.length) {
                    sessionStorage.setItem('cardShown', 'true');
                    if (onDone) onDone();
                    return;
                }
                
                const p = paragraphs[paragraphIndex];
                const txt = texts[paragraphIndex];
                p.textContent = '';
                p.style.opacity = '1';
                
                let charIndex = 0;
                function type() {
                    if (charIndex < txt.length) {
                        p.textContent = txt.substring(0, charIndex + 1);
                        charIndex++;
                        setTimeout(type, 45);
                    } else {
                        paragraphIndex++;
                        setTimeout(writeParagraph, 500);
                    }
                }
                
                type();
            }
            
            setTimeout(writeParagraph, 800);
        } else {
            // Texto ya planteado, sin animación
            if (message) {
                const paragraphs = message.querySelectorAll('p');
                const texts = Array.from(paragraphs).map(p => p.textContent);
                paragraphs.forEach((p, i) => {
                    p.textContent = texts[i];
                    p.style.opacity = '1';
                });
            }
            sessionStorage.setItem('cardShown', 'true');
            if (onDone) onDone();
        }
    }
    
    // Inicio: Kitty saluda
    setTimeout(() => {
        kitty.classList.add('entrance');
    }, 200);
    
    // Primera línea: aparece la nube y escribe despacio
    setTimeout(() => {
        bubble.classList.remove('hidden-bubble');
        bubble.classList.add('visible-bubble');
        const greeting = 'HOLAAA 👋 hoy está de cumpleaños<br>una persona muy especial. ¿Espera, eres tú?';
        typeWriter(welcomeText, greeting, 75, function() {
            // Segunda línea después de una pausa
            setTimeout(() => {
                typeWriter(secondLine, 'pulsa el botón de celebrar<br>para ver tu sorpresa 💝', 75, function() {
                    // Aparece el botón Celebrar
                    setTimeout(() => {
                        celebrateBtn.classList.remove('hidden-btn');
                        celebrateBtn.classList.add('fade-in');
                        shakeKitty();
                    }, 600);
                });
            }, 1200);
        });
    }, 600);
    
    // Kitty mueve de vez en cuando
    setInterval(() => {
        kitty.classList.remove('wiggle');
        void kitty.offsetWidth;
        kitty.classList.add('wiggle');
    }, 5000);
    
    // Botón Celebrar
    celebrateBtn.addEventListener('click', function() {
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 100);
        
        showCard(() => {
            // Los botones de la carta y el video aparecen al terminar la animación
            topBtns.classList.remove('hidden');
        });
        createPetals();
    });
    
    // Botón Video
    videoBtn.addEventListener('click', function() {
        videoOverlay.classList.remove('hidden');
        birthdayVideo.currentTime = 0;
        birthdayVideo.play();
    });
    
    // Cerrar el video
    videoClose.addEventListener('click', function() {
        videoOverlay.classList.add('hidden');
        birthdayVideo.pause();
    });
    videoOverlay.addEventListener('click', function(e) {
        if (e.target === videoOverlay) {
            videoOverlay.classList.add('hidden');
            birthdayVideo.pause();
        }
    });
    
    // ===== FUEGOS ARTIFICIALES =====
    const fxLayer = document.getElementById('fx-layer');
    const finalOverlay = document.getElementById('final-overlay');
    const finalFx = document.getElementById('final-fx');
    const finalBalloons = document.getElementById('final-balloons');
    const finalBtn = document.getElementById('final-btn');
    const finalClose = document.getElementById('final-close');
    
    const FIREWORK_COLORS = ['#ff5c8a', '#ffd54f', '#7c4dff', '#64dd8a', '#ff8a65', '#00bcd4', '#ffffff', '#ffeb3b'];
    
    function burstAt(x, y, host) {
        const n = 24 + Math.floor(Math.random() * 10);
        for (let i = 0; i < n; i++) {
            const s = document.createElement('div');
            s.className = 'spark';
            const ang = (Math.PI * 2 / n) * i + Math.random() * 0.6;
            const dist = 60 + Math.random() * 75;
            s.style.setProperty('--x0', x + 'px');
            s.style.setProperty('--y0', y + 'px');
            s.style.setProperty('--dx', Math.cos(ang) * dist + 'px');
            s.style.setProperty('--dy', Math.sin(ang) * dist + 'px');
            s.style.setProperty('--dur2', (0.7 + Math.random() * 0.6) + 's');
            s.style.setProperty('--c', FIREWORK_COLORS[Math.floor(Math.random() * FIREWORK_COLORS.length)]);
            host.appendChild(s);
            setTimeout(() => s.remove(), 1600);
        }
        const flash = document.createElement('div');
        flash.className = 'boom-flash';
        flash.style.setProperty('--x0', x + 'px');
        flash.style.setProperty('--y0', y + 'px');
        flash.style.setProperty('--c', FIREWORK_COLORS[Math.floor(Math.random() * FIREWORK_COLORS.length)]);
        host.appendChild(flash);
        setTimeout(() => flash.remove(), 600);
    }
    
    function launchRocket(x, y, host) {
        const rock = document.createElement('div');
        rock.className = 'rocket';
        rock.style.left = (x - 3) + 'px';
        rock.style.setProperty('--dy', (-(y - 30)) + 'px');
        rock.style.setProperty('--dur', (0.55 + Math.random() * 0.25) + 's');
        host.appendChild(rock);
        setTimeout(() => {
            rock.remove();
            burstAt(x, y, host);
        }, 700);
    }
    
    // Clic en el cielo de la carta → fuego artificial
    cardScreen.addEventListener('click', function(e) {
        if (e.target.closest('.card') || e.target.closest('#top-btns')) return;
        if (e.clientY < window.innerHeight * 0.35) {
            launchRocket(e.clientX, e.clientY, fxLayer);
        }
    });
    
    // ===== SORPRESA FINAL =====
    let musicMuted = false;
    const mananitasAudio = document.getElementById('mananitas-audio');

    function playMananitas() {
        if (musicMuted) return;
        mananitasAudio.currentTime = 0;
        mananitasAudio.play().catch(function() {});
    }

    function stopMananitas() {
        mananitasAudio.pause();
        mananitasAudio.currentTime = 0;
    }

    const musicBtn = document.getElementById('music-btn');
    musicBtn.addEventListener('click', function() {
        musicMuted = !musicMuted;
        this.textContent = musicMuted ? '🔇' : '🔊';
        this.title = musicMuted ? 'Activar música' : 'Silenciar música';
        if (musicMuted) {
            mananitasAudio.pause();
        } else {
            playMananitas();
        }
    });
    mananitasAudio.addEventListener('error', function() {
        musicBtn.textContent = '🎵';
        musicBtn.title = 'No se encontró la música (Un Año Más - Cumpleaños Feliz.mp3)';
        musicBtn.disabled = true;
    });

    function spawnBalloon() {
        const b = document.createElement('div');
        b.className = 'balloon';
        const combos = [
            ['#ff6fa5', '#ffd6e8'],
            ['#ffd54f', '#fff3c4'],
            ['#b388ff', '#e8ddff'],
            ['#80deea', '#d5f6fb'],
            ['#ff8a80', '#ffd9d3']
        ];
        const combo = combos[Math.floor(Math.random() * combos.length)];
        b.style.setProperty('--c', combo[0]);
        b.style.setProperty('--c2', combo[1]);
        b.style.left = (5 + Math.random() * 85) + '%';
        b.style.setProperty('--dur', (7 + Math.random() * 6) + 's');
        b.addEventListener('click', function() {
            const r = b.getBoundingClientRect();
            const p = document.createElement('div');
            p.className = 'balloon-pop';
            p.textContent = '💥✨';
            p.style.left = (r.left + 34) + 'px';
            p.style.top = (r.top + 45) + 'px';
            finalBalloons.appendChild(p);
            setTimeout(() => p.remove(), 700);
            if (b.parentNode) b.remove();
        });
        finalBalloons.appendChild(b);
        setTimeout(() => { if (b.parentNode) b.remove(); }, 16000);
    }
    
    function confettiRain() {
        const colors = ['#ff5c8a', '#ffd54f', '#7c4dff', '#64dd8a', '#ff8a65', '#00bcd4'];
        for (let i = 0; i < 18; i++) {
            const c = document.createElement('div');
            c.className = 'confetti-g';
            c.style.setProperty('--cl', Math.random() * 100 + '%');
            c.style.setProperty('--du', (2.4 + Math.random() * 1.8) + 's');
            c.style.background = colors[Math.floor(Math.random() * colors.length)];
            if (Math.random() > 0.5) c.style.borderRadius = '50%';
            finalFx.appendChild(c);
            setTimeout(() => c.remove(), 5500);
        }
    }
    
    let fwInterval, blInterval, cfInterval;
    
    function openFinal() {
        finalOverlay.classList.remove('hidden');
        playMananitas();
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                launchRocket(Math.random() * window.innerWidth, window.innerHeight * (0.15 + Math.random() * 0.25), finalFx);
            }, 300 + i * 600);
        }
        fwInterval = setInterval(() => {
            launchRocket(Math.random() * window.innerWidth, window.innerHeight * (0.15 + Math.random() * 0.25), finalFx);
        }, 1500);
        for (let i = 0; i < 4; i++) spawnBalloon();
        blInterval = setInterval(spawnBalloon, 1300);
        confettiRain();
        cfInterval = setInterval(confettiRain, 900);
    }
    
    function closeFinal() {
        clearInterval(fwInterval);
        clearInterval(blInterval);
        clearInterval(cfInterval);
        stopMananitas();
        finalOverlay.classList.add('hidden');
        finalFx.innerHTML = '';
        finalBalloons.innerHTML = '';
    }
    
    finalBtn.addEventListener('click', openFinal);
    finalClose.addEventListener('click', closeFinal);
    finalOverlay.addEventListener('click', function(e) {
        if (e.target === finalOverlay || e.target.classList.contains('final-fx') || e.target.classList.contains('final-balloons')) {
            launchRocket(e.clientX, e.clientY, finalFx);
        }
    });
    
    // Si se vuelve desde la carta, ir directo a la pantalla de flores
    const params = new URLSearchParams(location.search);
    if (params.get('vista') === 'carta') {
        showCard(() => {
            topBtns.classList.remove('hidden');
        });
    }
});
