document.addEventListener('DOMContentLoaded', () => {
    const quoteText = document.getElementById('quote-text');
    const quoteAuthor = document.getElementById('quote-author');
  
    fetch('https://zenquotes.io/api/random')
      .then(res => res.ok ? res.json() : Promise.reject(res))
      .then(([{ q, a }]) => {
        quoteText.textContent = `“${q}”`;
        quoteAuthor.textContent = `- ${a}`;
      })
      .catch(() => {
        quoteText.textContent = 'Failed to load quote.';
      });
  
    const stocksBtn = document.getElementById('stocksButton') || document.querySelector('.stocks-btn');
    const dogsBtn = document.getElementById('dogsButton') || document.querySelector('.dogs-btn');
  
    if (stocksBtn) {
      stocksBtn.addEventListener('click', e => {
        e.preventDefault?.();
        location.href = 'stocks.html';
      });
    }
  
    if (dogsBtn) {
      dogsBtn.addEventListener('click', e => {
        e.preventDefault?.();
        location.href = 'dogs.html';
      });
    }
  
    const micOnBtn = document.getElementById('audio-on');
    const micOffBtn = document.getElementById('audio-off');
  
    const setListening = isOn => {
      micOnBtn.classList.toggle('listening', isOn);
      micOffBtn.disabled = !isOn;
      micOnBtn.disabled = isOn;
    };
  
    micOnBtn.addEventListener('click', () => {
      try {
        window.annyang.start({ autoRestart: true, continuous: true });
        setListening(true);
      } catch (err) {
        console.error('Failed to start microphone:', err);
      }
    });
  
    micOffBtn.addEventListener('click', () => {
      try {
        if (window.annyang && window.annyang.isListening()) window.annyang.abort();
      } finally {
        setListening(false);
      }
    });
  
    if (annyang) {
      console.log('annyang is available');
      annyang.addCallback('start', () => {
        console.log('annyang is listening');
        setListening(true);
      });
    }
  
    if (window.annyang) {
      window.annyang.addCommands({
        'open stocks': () => location.href = 'stocks.html',
        'go to stocks': () => location.href = 'stocks.html',
        'open dogs': () => location.href = 'dogs.html',
        'go to dogs': () => location.href = 'dogs.html',
        'hello': () => alert('Hello world'),
        'change color': () => {
          const colors = ['red', 'green', 'blue', 'yellow', 'purple'];
          const randomColor = colors[Math.floor(Math.random() * colors.length)];
          document.body.style.backgroundColor = randomColor;
        }
      });
    }
  
    if (window.annyang) {
      window.annyang.addCallback('end', () => setListening(false));
      window.annyang.addCallback('error', () => setListening(false));
    }
  });
  