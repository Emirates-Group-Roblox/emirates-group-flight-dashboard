// === Common Utilities ===
function logout() {
  localStorage.removeItem("occUser");
  window.location.href = "login.html";
}
function logoutCrew() {
  localStorage.removeItem("crewId");
  window.location.href = "crew-login.html";
}

function getStatusColor(status) {
  switch (status.toLowerCase()) {
    case "on time": return "bg-green-200 text-green-800";
    case "boarding": return "bg-yellow-200 text-yellow-800";
    case "delayed": return "bg-red-200 text-red-800";
    case "cancelled": return "bg-gray-200 text-gray-800";
    default: return "bg-blue-200 text-blue-800";
  }
}

function getCountdown(depTime) {
  const now = new Date();
  const dep = new Date(depTime);
  const diff = Math.floor((dep - now) / 1000);
  if (diff <= 0) return "Departed";
  const hours = Math.floor(diff / 3600);
  const mins = Math.floor((diff % 3600) / 60);
  return `${hours}h ${mins}m`;
}

// === OCC Flight Management ===
async function createFlight() {
  const flight = {
    number: document.getElementById('fNumber').value,
    aircraft: document.getElementById('aircraft').value,
    departure: document.getElementById('departure').value,
    arrival: document.getElementById('arrival').value,
    dep_time: document.getElementById('dep_time').value,
    arr_time: document.getElementById('arr_time').value,
    terminal: document.getElementById('terminal').value,
    gate: document.getElementById('gate').value,
    route: document.getElementById('route').value,
    status: document.getElementById('status').value,
    date: document.getElementById('date').value,
    crew: []
  };

  const res = await fetch('flight.json');
  const data = await res.json();
  data.push(flight);
  await saveFlights(data);
  renderFlights(data);
}

async function saveFlights(data) {
  await fetch('flight.json', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
}

async function renderFlights(data = null) {
  if (!data) {
    const res = await fetch('flight.json');
    data = await res.json();
  }
  const container = document.getElementById("flightList");
  container.innerHTML = "";
  data.forEach((f, i) => {
    container.innerHTML += `
      <div class="p-4 bg-white dark:bg-gray-800 border rounded shadow">
        <h3 class="text-xl font-bold">${f.number} - ${f.aircraft}</h3>
        <p><strong>Route:</strong> ${f.departure} → ${f.arrival}</p>
        <p><strong>Departure:</strong> ${f.dep_time} (${getCountdown(f.dep_time)})</p>
        <p><strong>Status:</strong> <span class="px-2 py-1 rounded ${getStatusColor(f.status)}">${f.status}</span></p>
      </div>
    `;
  });
}

// === Crew Dashboard ===
async function loadCrewFlights() {
  const id = localStorage.getItem("crewId");
  const res = await fetch('flight.json');
  const data = await res.json();

  const assigned = data.filter(f => f.crew?.includes(id));
  const container = document.getElementById("crewFlights");
  if (assigned.length === 0) {
    container.innerHTML = `<div class="text-gray-500 text-center"><img src="https://media.discordapp.net/attachments/1277316946932531292/1383731218494914600/A380-800_PIC_1.png?format=webp&width=688&height=365" class="mx-auto mb-4"/><p>No flights assigned. Please check with operations control.</p></div>`;
    return;
  }

  container.innerHTML = "";
  assigned.forEach(f => {
    container.innerHTML += `
      <div class="p-4 bg-white dark:bg-gray-800 border rounded shadow">
        <h3 class="text-xl font-bold">${f.number} - ${f.aircraft}</h3>
        <p><strong>Route:</strong> ${f.departure} → ${f.arrival}</p>
        <p><strong>Departure:</strong> ${f.dep_time}</p>
        <p><strong>Status:</strong> ${f.status}</p>
        <a href="briefing/${f.number}.pdf" class="text-blue-600 underline" target="_blank">Briefing Document</a>
      </div>
    `;
  });
}
