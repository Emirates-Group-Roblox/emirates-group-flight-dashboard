async function loadFlights() {
  const response = await fetch('flights.json');
  const data = await response.json();
  const board = document.getElementById('flight-board');

  if (data.length === 0) {
    board.innerHTML = "<p>No flights scheduled. Please check back soon.</p>";
    return;
  }

  board.innerHTML = '';
  data.forEach(flight => {
    const div = document.createElement('div');
    div.className = 'flight';
    div.innerHTML = `
      <h2>Flight ${flight.number} - ${flight.aircraft}</h2>
      <p><strong>Route:</strong> ${flight.departure} → ${flight.arrival}</p>
      <p><strong>Departure:</strong> ${flight.dep_time} | <strong>Arrival:</strong> ${flight.arr_time}</p>
      <p><strong>Terminal:</strong> ${flight.terminal} | <strong>Gate:</strong> ${flight.gate}</p>
      <p><strong>Status:</strong> ${flight.status}</p>
    `;
    board.appendChild(div);
  });
}

loadFlights();

