import { POLYGON_API_KEY } from './config.js';

document.addEventListener('DOMContentLoaded', () => {
  const tickerInput = document.getElementById('ticker');
  const rangeSelect = document.getElementById('range');
  const chartButton = document.getElementById('chartButton');
  const ctx = document.getElementById('chart').getContext('2d');
  let chart;

  async function drawChart(ticker, days) {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - days);

    const startStr = start.toISOString().split('T')[0];
    const endStr = end.toISOString().split('T')[0];

    const url = `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/${startStr}/${endStr}?apiKey=${POLYGON_API_KEY}`;

    try {
      const data = await fetch(url).then(r => r.json());
      if (!data.results?.length) throw new Error('No data');

      const labels = data.results.map(r => new Date(r.t).toLocaleDateString());
      const values = data.results.map(r => r.c);

      chart?.destroy();
      chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels,
          datasets: [
            {
              label: `${ticker} close`,
              data: values,
              tension: 0.2
            }
          ]
        }
      });
    } catch (err) {
      alert('Failed to load chart: ' + err.message);
    }
  }

  chartButton.addEventListener('click', () => {
    const ticker = tickerInput.value.trim().toUpperCase();
    const days = parseInt(rangeSelect.value, 10);
    if (ticker) drawChart(ticker, days);
  });

  const redditTable = document.querySelector('#reddit-table tbody');
  fetch('https://tradestie.com/api/v1/apps/reddit?date=2022-04-03')
    .then(r => r.json())
    .then(data => {
      redditTable.innerHTML = '';
      data.slice(0, 5).forEach(({ ticker, no_of_comments, sentiment }) => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td><a href="https://finance.yahoo.com/quote/${ticker}" target="_blank">${ticker}</a></td>
          <td>${no_of_comments}</td>
          <td>
            <img
              src="${sentiment === 'Bullish'
                ? 'https://static.thenounproject.com/png/3328202-200.png'
                : 'https://static.thenounproject.com/png/3328203-200.png'}"
              alt="${sentiment}" width="24" height="24">
          </td>`;
        redditTable.appendChild(row);
      });
    });

  if (window.annyang) {
    window.annyang.addCommands({
      'lookup *symbol': sym => drawChart(sym.toUpperCase(), 30),
      'open home': () => location.href = 'index.html',
      'go home': () => location.href = 'index.html',
      'open dogs': () => location.href = 'dogs.html',
      'hello': () => alert('Hello world')
    });
  }

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
