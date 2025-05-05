document.addEventListener('DOMContentLoaded', () => {
  const carousel = document.getElementById('dog-carousel');
  const wrapper = carousel.querySelector('.slider-wrapper');
  const breedsBox = document.getElementById('breeds-container');
  const infoBox = document.getElementById('infoBox');

  fetch('https://dog.ceo/api/breeds/image/random/10')
    .then(r => r.json())
    .then(({ message }) => {
      message.forEach(src => {
        const d = document.createElement('div');
        d.className = 'slider-slide';
        d.innerHTML = `<img src="${src}" alt="Random dog">`;
        wrapper.appendChild(d);
      });

      new SimpleSlider('#dog-carousel', {
        autoplay: true,
        delay: 7000,
        enableDrag: true,
        loop: true
      });
    });

  fetch('https://api.thedogapi.com/v1/breeds')
    .then(r => r.json())
    .then(breeds => {
      breeds.sort(() => Math.random() - 0.5);
      breeds.slice(0, 10).forEach(breed => {
        const btn = document.createElement('button');
        btn.textContent = breed.name;
        btn.className = 'breed-btn';
        btn.addEventListener('click', () => showBreed(breed));
        breedsBox.appendChild(btn);
      });

      window.annyang?.addCommands({
        'load dog breed *breed': b => {
          [...breedsBox.children]
            .find(el => el.textContent.toLowerCase() === b.toLowerCase())
            ?.click();
        }
      });
    });

  function showBreed(b) {
    infoBox.innerHTML = `
      <h3>${b.name}</h3>
      <p>${b.description || b.temperament || 'No description available.'}</p>
      <p>Life span: ${b.life_span}</p>`;
    infoBox.hidden = false;
  }

  window.annyang?.addCommands({
    'open home': () => location.href = 'index.html',
    'go home': () => location.href = 'index.html',
    'open stocks': () => location.href = 'stocks.html',
    'go to stocks': () => location.href = 'stocks.html',
    'hello': () => alert('Hello world')
  });

  const micOnBtn = document.getElementById('audio-on');
  const micOffBtn = document.getElementById('audio-off');

  if (micOnBtn && micOffBtn) {
    const setListening = on => {
      micOnBtn.classList.toggle('listening', on);
      micOnBtn.disabled = on;
      micOffBtn.disabled = !on;
    };

    micOnBtn.addEventListener('click', () => {
      try {
        window.annyang.start({ autoRestart: true, continuous: true });
      } catch (e) {
        console.error(e);
      }
      setListening(true);
    });

    micOffBtn.addEventListener('click', () => {
      try {
        if (window.annyang?.isListening()) window.annyang.abort();
      } finally {
        setListening(false);
      }
    });

    window.annyang?.addCallback('end', () => setListening(false));
    window.annyang?.addCallback('error', () => setListening(false));
  }
});
