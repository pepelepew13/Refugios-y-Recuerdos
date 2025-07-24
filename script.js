// Estrellas en canvas dinámico
const canvas = document.getElementById('stars');
const ctx = canvas.getContext('2d');
function resizeCanvas() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = document.body.scrollHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const stars = Array.from({length: 500}, () => ({
  x: Math.random() * w,
  y: Math.random() * h,
  r: Math.random() * 2.5 + 0.5,
  dx: (Math.random() - 0.5) * 0.09,
  dy: (Math.random() - 0.5) * 0.09,
  bright: Math.random() < 0.08
}));
function draw() {
  ctx.clearRect(0, 0, w, h);
  stars.forEach(s => {
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, 2 * Math.PI);
    ctx.globalAlpha = s.bright ? 1 : 0.7 + Math.random() * 0.3;
    ctx.fillStyle = s.bright ? '#ffe066' : '#fff';
    ctx.fill();
    s.x += s.dx; s.y += s.dy;
    if (s.x < 0 || s.x > w) s.dx *= -1;
    if (s.y < 0 || s.y > h) s.dy *= -1;
  });
  ctx.globalAlpha = 1;

  // 👇 5% de probabilidad en cada frame
  if (Math.random() < 0.005) {
    createShootingStar();
  }

  requestAnimationFrame(draw);
}

draw();

// Estrellas estáticas fijas
function createStaticStars(num) {
  const container = document.querySelector('.static-stars');
  container.innerHTML = '';
  for (let i = 0; i < num; i++) {
    const star = document.createElement('div');
    star.className = 'star-static';
    const size = Math.random() * 2.5 + 0.5;
    star.style.width = size + 'px';
    star.style.height = size + 'px';
    star.style.left = Math.random() * window.innerWidth + 'px';
    star.style.top = Math.random() * document.body.scrollHeight + 'px';
    star.style.opacity = 0.8 + Math.random() * 0.2;
    star.style.background = Math.random() < 0.15 ? '#ffe066' : '#fff';
    container.appendChild(star);
  }
}

// Estrellas decorativas tipo constelación
function createFugazStars(num) {
  for (let i = 0; i < num; i++) {
    const star = document.createElement('div');
    star.className = 'star-fugaz';
    const size = Math.random() * 2.5 + 1;
    star.style.width = size + 'px';
    star.style.height = size + 'px';
    let angle = Math.random() * Math.PI * 2;
    let radius = 200 + Math.random() * 600;
    let cx = window.innerWidth / 2 + Math.cos(angle) * radius;
    let cy = document.body.scrollHeight / 2 + Math.sin(angle) * radius;
    star.style.left = cx + 'px';
    star.style.top = cy + 'px';
    star.style.opacity = 0.9;
    star.style.background = '#ffe066';
    star.style.transition = 'none';
    document.body.appendChild(star);
  }
}

// Estrellas fugaces animadas recurrentes
function createShootingStar() {
  const star = document.createElement('div');
  star.className = 'shooting-star';

  // Posición inicial en cualquier parte del alto de la página
  const startX = Math.random() * window.innerWidth * 0.9;
  const startY = Math.random() * document.body.scrollHeight;

  // Trayectoria diagonal
  const distance = 300 + Math.random() * 250;
  const angle = Math.PI / 4; // 45°
  const endX = startX + distance * Math.cos(angle);
  const endY = startY + distance * Math.sin(angle);

  // Tamaño y brillo más destacados
  const size = 3 + Math.random() * 3;
  star.style.width = `${size}px`;
  star.style.height = `${size}px`;
  star.style.left = `${startX}px`;
  star.style.top = `${startY}px`;
  star.style.opacity = 1;
  star.style.background = 'var(--highlight)';
  star.style.borderRadius = '50%';
  star.style.position = 'absolute';
  star.style.pointerEvents = 'none';
  star.style.zIndex = 1;
  star.style.boxShadow = `0 0 25px 10px var(--highlight)`;
  star.style.filter = 'blur(0.5px)';

  document.body.appendChild(star);

  requestAnimationFrame(() => {
    star.style.transition = 'transform 1.2s ease-out, opacity 1.2s ease-out';
    star.style.transform = `translate(${endX - startX}px, ${endY - startY}px)`;
    star.style.opacity = 0;
  });

  setTimeout(() => star.remove(), 1300);
}

setInterval(() => {
  createShootingStar();
  if (Math.random() < 0.5) createShootingStar(); // 50% chance de lanzar una más
}, 1000);



// Estrella viajera entre planetas
const starEl = document.getElementById('star');
const sections = document.querySelectorAll('section');
let animating = false;
function getRandomCurve(start, end) {
  const cp1x = start.x + (Math.random()-0.5)*200;
  const cp1y = start.y + (Math.random()-0.5)*200;
  const cp2x = end.x + (Math.random()-0.5)*200;
  const cp2y = end.y + (Math.random()-0.5)*200;
  return {cp1x, cp1y, cp2x, cp2y};
}
function animateStar(start, end) {
  if (animating) return;
  animating = true;
  const duration = 1200;
  const curve = getRandomCurve(start, end);
  let startTime = null;
  function step(ts) {
    if (!startTime) startTime = ts;
    const t = Math.min((ts - startTime) / duration, 1);
    const x = (1-t)**3*start.x + 3*(1-t)**2*t*curve.cp1x + 3*(1-t)*t**2*curve.cp2x + t**3*end.x;
    const y = (1-t)**3*start.y + 3*(1-t)**2*t*curve.cp1y + 3*(1-t)*t**2*curve.cp2y + t**3*end.y;
    starEl.style.left = x + 'px';
    starEl.style.top = y + 'px';
    starEl.style.opacity = 1;
    starEl.style.transform = `scale(${1.2+Math.sin(t*6)*0.3}) rotate(${Math.sin(t*8)*30}deg)`;
    if (t < 1) {
      requestAnimationFrame(step);
    } else {
      setTimeout(() => { starEl.style.opacity = 0; animating = false; }, 400);
    }
  }
  requestAnimationFrame(step);
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');

      // Forzar repintado si contiene imágenes
      const imgs = entry.target.querySelectorAll('img');
      imgs.forEach(img => {
        if (img.complete) {
          img.style.display = 'none';
          void img.offsetHeight; // forzar reflow
          img.style.display = '';
        }
      });

      const planet = entry.target.querySelector('.planet');
      if (planet) {
        const rect = planet.getBoundingClientRect();
        const start = starEl.getBoundingClientRect();
        const end = {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2 + window.scrollY
        };
        const startPos = {
          x: start.left,
          y: start.top + window.scrollY
        };
        animateStar(startPos, end);
      }
    }
  });
}, { threshold: 0.3 });
sections.forEach(sec => observer.observe(sec));

// Planetas y viajera
let planetPositions = [];
function updatePlanetPositions() {
  planetPositions = Array.from(document.querySelectorAll('.planet')).map(planet => {
    const rect = planet.getBoundingClientRect();
    return {
      x: rect.left + rect.width/2,
      y: rect.top + rect.height/2 + window.scrollY
    };
  });
}
function moveTravelingStar() {
  let i = 0;
  function animate() {
    if (planetPositions.length === 0) return requestAnimationFrame(animate);
    const pos = planetPositions[i % planetPositions.length];
    starEl.style.left = pos.x + 'px';
    starEl.style.top = pos.y + 'px';
    starEl.style.opacity = 1;
    starEl.style.transform = `scale(1.5) rotate(${Math.random()*40-20}deg)`;
    setTimeout(() => {
      starEl.style.opacity = 0.5;
      i++;
      setTimeout(animate, 900);
    }, 900);
  }
  animate();
}

window.addEventListener('DOMContentLoaded', () => {
  const planetColors = ['yellow', 'blue', 'pink', 'green', 'violet'];
  document.querySelectorAll('.planet').forEach((planet, i) => {
    planet.classList.add(planetColors[i % planetColors.length]);
  });
  createStaticStars(10);
  createFugazStars(0);
  updatePlanetPositions();
  moveTravelingStar();
});
window.addEventListener('resize', () => {
  updatePlanetPositions();
  createStaticStars(10);
});

const cuentoPaginas = [
  "Había una vez un adulto. Vestía ropa seria, caminaba rápido, y sabía muchas cosas importantes: sabía cómo responder correos, pagar impuestos y fingir que no estaba cansado.",
  "Tenía responsabilidades, agendas, metas y plazos. Todo estaba bajo control. Pero ese adulto tenía un secreto: dentro de él vivía un niño.",
  "Un niño que no sabía de relojes, pero sí sabía contar estrellas. Un niño que no firmaba papeles, pero dibujaba mundos con una crayola.",
  "Un niño que a veces se asomaba desde adentro y decía: — ¿Y si hoy saltamos en los charcos? Pero el adulto no podía. Tenía reuniones. Tenía llamadas. Cosas “más importantes”.",
  "El niño, poco a poco, se fue escondiendo. Ya no hablaba tan fuerte. Ya no insistía. Solo miraba desde algún rincón oscuro del corazón, esperando...",
  "Una mañana cualquiera, el adulto se despertó y sintió algo raro. Un silencio suave. Como si algo faltara.",
  "Se miró al espejo y se vio mayor... pero vacío. Y se preguntó: — ¿Cuándo fue la última vez que me reí sin importar el ruido? — ¿O que construí una cabaña con cobijas para imaginar que era una nave?",
  "No lo recordaba. Ese día, en lugar de irse al trabajo, se detuvo. Se sentó en el suelo. Cerró los ojos. Y esperó. No sabía bien qué esperaba, solo... escuchaba.",
  "Entonces, muy despacito, desde adentro, una voz pequeña le dijo: — ¡Estás aquí! Pensé que te habías olvidado de mí para siempre...",
  "El adulto no respondió con palabras. Solo sonrió, con los ojos llenos de lágrimas. Porque sí, ahí estaba. El niño seguía ahí.",
  "Le mostró dibujos viejos, cicatrices en las rodillas, canciones inventadas. Recordaron juntos que la cama era un barco y el suelo, lava.",
  "Le recordó lo que era tener miedo por primera vez, y cómo una mano cálida te calmaba con un solo abrazo.",
  "Le recordó lo que era reírse sin pensar en cómo se veía. Lo que era preguntar sin miedo. Lo que era jugar sin ganar nada.",
  "Entonces el adulto se quitó los zapatos. Se tumbó en el suelo. Y rió. De verdad. Como no lo hacía desde niño.",
  "Desde ese día, el adulto cambió un poco. Seguía teniendo cosas de adulto, claro. Pero cada tanto, se metía debajo de una sábana.",
  "Le hablaba al cielo. O simplemente se quedaba en silencio, dejando que el niño interior le contara algo nuevo... o algo viejo que había olvidado.",
  "A veces, cuando otros adultos lo veían haciendo cosas 'sin sentido', le preguntaban: — ¿Para qué haces eso? Y él respondía: — Porque es lo que haría mi niño interior. Y eso bastaba.",
  "Y si estás escuchando este cuento ahora, desde dentro de un fuerte de sábanas, tal vez, solo tal vez... tu niño interior también esté cerca, esperando a que vuelvas a jugar con él.",
  "Solo tienes que cerrar los ojos, respirar profundo, y preguntarle bajito: — ¿Estás ahí? Y si estás en silencio el tiempo suficiente, seguro te responde."
];

let indiceFlip = 0;
const portada = document.getElementById('portada-libro');
const flipContainer = document.getElementById('pagina-doble');
const controles = document.getElementById('controles-libro');

function renderFlip() {
  flipContainer.innerHTML = '';
  for (let i = 0; i < 2; i++) {
    const texto = cuentoPaginas[indiceFlip + i];
    if (texto) {
      const pag = document.createElement('div');
      pag.className = 'pagina-flip';
      pag.innerHTML = texto;
      flipContainer.appendChild(pag);
    }
  }
}

document.getElementById('empezar-cuento').addEventListener('click', () => {
  portada.classList.add('oculto');
  flipContainer.classList.remove('oculto');
  controles.classList.remove('oculto');
  renderFlip();
});

document.getElementById('siguiente').addEventListener('click', () => {
  if (indiceFlip + 2 < cuentoPaginas.length) {
    indiceFlip += 2;
    renderFlip();
  }
});
document.getElementById('anterior').addEventListener('click', () => {
  if (indiceFlip - 2 >= 0) {
    indiceFlip -= 2;
    renderFlip();
  }
});

function scrollCarousel(direction) {
  const carousel = document.getElementById("carrusel");
  const scrollAmount = 300;
  carousel.scrollLeft += direction * scrollAmount;
}

const carril = document.getElementById("carril");
const items = document.querySelectorAll(".carrusel-item");
const miniaturas = document.getElementById("miniaturas");

let index = 0;

function actualizarCarrusel() {
  items.forEach((item, i) => {
    item.classList.remove("active");
    if (i === index) item.classList.add("active");
  });

  // Desplazamiento centrado
  const itemWidth = items[0].offsetWidth + 40; // ancho + gap
  const offset = -index * itemWidth + carril.offsetWidth / 2 - itemWidth / 2;
  carril.style.transform = `translateX(${offset}px)`;

  // Miniaturas
  document.querySelectorAll(".miniaturas div").forEach((dot, i) => {
    dot.classList.toggle("active", i === index);
  });
}

function moverCarrusel(direccion) {
  index = (index + direccion + items.length) % items.length;
  actualizarCarrusel();
}

items.forEach((_, i) => {
  const dot = document.createElement("div");
  dot.addEventListener("click", () => {
    index = i;
    actualizarCarrusel();
  });
  miniaturas.appendChild(dot);
});

actualizarCarrusel();
setInterval(() => moverCarrusel(1), 8000); // rotación automática

// Modal para ver imagen ampliada
function verImagen(src) {
  const modal = document.getElementById("modalImagen");
  const img = document.getElementById("imagenExpandida");
  img.src = src;
  modal.style.display = "flex";
}

function cerrarModal() {
  const modal = document.getElementById("modalImagen");
  modal.style.display = "none";
}

// loop automático opcional
setInterval(() => moverCarrusel(1), 3000);

function comenzarRecorrido() {
  const portada = document.getElementById("portada-bienvenida");
  const intro = document.getElementById("intro");

  // Paso 1: animación de salida
  portada.style.transition = "opacity 0.8s ease";
  portada.style.opacity = "0";
  portada.style.pointerEvents = "none";

  // Paso 2: esperar a que termine la animación y luego hacer scroll
  setTimeout(() => {
    portada.style.display = "none";

    // Paso 3: animación de scroll suave
    intro.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 800); // mismo tiempo que el fade-out
}

window.addEventListener("scroll", () => {
  const indicador = document.getElementById("scroll-indicador");
  if (window.scrollY > 500) {
    indicador.style.opacity = "0";
  } else {
    indicador.style.opacity = "0.8";
  }
});


