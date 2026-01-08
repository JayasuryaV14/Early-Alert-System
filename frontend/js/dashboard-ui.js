// Socket.IO Client Connection
const socket = io("http://localhost:5000");

// State
let portals = [];
let chartInstances = {};

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  loadPortals();
  setupEventListeners();
  initializeCharts();
  
  // Listen for real-time portal updates
  socket.on("portal-update", (portal) => {
    updatePortalInList(portal);
    updateSummaryCards();
    updateCharts();
  });
  
  socket.on("connect", () => {
    console.log("✅ Connected to real-time monitoring server");
    updateConnectionStatus(true);
  });
  
  socket.on("disconnect", () => {
    console.log("❌ Disconnected from server");
    updateConnectionStatus(false);
  });
  
  // Update connection status UI
  window.updateConnectionStatus = function(connected) {
    const statusEl = document.getElementById("connectionStatus");
    const dot = statusEl.querySelector(".status-dot");
    const text = document.getElementById("connectionText");
    
    if (connected) {
      dot.classList.add("connected");
      text.textContent = "Connected";
    } else {
      dot.classList.remove("connected");
      text.textContent = "Disconnected";
    }
  };
});

// Load portals from API
async function loadPortals() {
  try {
    const response = await fetch("http://localhost:5000/api/portals");
    portals = await response.json();
    renderPortals();
    updateSummaryCards();
    updateCharts();
  } catch (error) {
    console.error("Error loading portals:", error);
  }
}

// Setup event listeners
function setupEventListeners() {
  document.getElementById("addPortalBtn").addEventListener("click", addPortal);
}

// Add new portal
async function addPortal() {
  const name = prompt("Enter Portal Name:");
  if (!name) return;
  
  const url = prompt("Enter Portal URL (e.g., google.com):");
  if (!url) return;
  
  try {
    const response = await fetch("http://localhost:5000/api/portals/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, url })
    });
    
    if (response.ok) {
      const portal = await response.json();
      portals.push(portal);
      renderPortals();
      updateSummaryCards();
      updateCharts();
    } else {
      alert("Failed to add portal");
    }
  } catch (error) {
    console.error("Error adding portal:", error);
    alert("Error adding portal");
  }
}

// Delete portal
async function deletePortal(id) {
  if (!confirm("Are you sure you want to delete this portal?")) return;
  
  try {
    const response = await fetch(`http://localhost:5000/api/portals/${id}`, {
      method: "DELETE"
    });
    
    if (response.ok) {
      portals = portals.filter(p => p._id !== id);
      renderPortals();
      updateSummaryCards();
      updateCharts();
    } else {
      alert("Failed to delete portal");
    }
  } catch (error) {
    console.error("Error deleting portal:", error);
    alert("Error deleting portal");
  }
}

// Render portal list
function renderPortals() {
  const list = document.getElementById("portalList");
  list.innerHTML = "";
  
  if (portals.length === 0) {
    list.innerHTML = '<p style="text-align:center;padding:20px;color:#666;">No portals added yet. Click "+ Add Portal" to start monitoring.</p>';
    return;
  }
  
  portals.forEach(portal => {
    const card = document.createElement("div");
    card.className = "portal-card";
    card.innerHTML = `
      <div class="portal-header">
        <h4>${portal.name}</h4>
        <button onclick="deletePortal('${portal._id}')" class="delete-btn">×</button>
      </div>
      <div class="portal-url">${portal.url}</div>
      <div class="portal-stats">
        <div class="stat">
          <span class="stat-label">Status:</span>
          <span class="stat-value status-${portal.status?.toLowerCase()}">${portal.status || "ONLINE"}</span>
        </div>
        <div class="stat">
          <span class="stat-label">Ping:</span>
          <span class="stat-value">${portal.ping >= 0 ? portal.ping + " ms" : "N/A"}</span>
        </div>
        <div class="stat">
          <span class="stat-label">Response:</span>
          <span class="stat-value">${portal.response >= 0 ? portal.response + " ms" : "N/A"}</span>
        </div>
        <div class="stat">
          <span class="stat-label">Packet Loss:</span>
          <span class="stat-value">${portal.packetLoss || 0}%</span>
        </div>
        <div class="stat">
          <span class="stat-label">Last Checked:</span>
          <span class="stat-value">${portal.lastChecked || "Never"}</span>
        </div>
      </div>
    `;
    list.appendChild(card);
  });
}

// Update portal in list (real-time)
function updatePortalInList(updatedPortal) {
  const index = portals.findIndex(p => p._id === updatedPortal._id);
  if (index !== -1) {
    portals[index] = { ...portals[index], ...updatedPortal };
    renderPortals();
  }
}

// Update summary cards
function updateSummaryCards() {
  const total = portals.length;
  const online = portals.filter(p => p.status === "ONLINE").length;
  const offline = portals.filter(p => p.status === "OFFLINE").length;
  const unstable = portals.filter(p => p.status === "UNSTABLE").length;
  
  document.getElementById("total").textContent = total;
  document.getElementById("online").textContent = online;
  document.getElementById("offline").textContent = offline;
  document.getElementById("unstable").textContent = unstable;
}

// Initialize charts
function initializeCharts() {
  // Bar Chart for Live Status
  const barCtx = document.getElementById("barChart");
  if (barCtx) {
    chartInstances.bar = new Chart(barCtx, {
      type: "bar",
      data: {
        labels: [],
        datasets: [{
          label: "Response Time (ms)",
          data: [],
          backgroundColor: "rgba(54, 162, 235, 0.6)",
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { beginAtZero: true }
        },
        animation: { duration: 300 }
      }
    });
  }
  
  // Donut Chart for Network Health
  const donutCtx = document.getElementById("donutChart");
  if (donutCtx) {
    chartInstances.donut = new Chart(donutCtx, {
      type: "doughnut",
      data: {
        labels: ["Online", "Unstable", "Offline"],
        datasets: [{
          data: [0, 0, 0],
          backgroundColor: ["#0f9b0f", "#ffa500", "#ff4c4c"],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 300 }
      }
    });
  }
}

// Update charts with real-time data
function updateCharts() {
  // Update Bar Chart
  if (chartInstances.bar) {
    const labels = portals.map(p => p.name);
    const data = portals.map(p => p.response >= 0 ? p.response : 0);
    
    chartInstances.bar.data.labels = labels;
    chartInstances.bar.data.datasets[0].data = data;
    chartInstances.bar.update();
  }
  
  // Update Donut Chart
  if (chartInstances.donut) {
    const online = portals.filter(p => p.status === "ONLINE").length;
    const unstable = portals.filter(p => p.status === "UNSTABLE").length;
    const offline = portals.filter(p => p.status === "OFFLINE").length;
    
    chartInstances.donut.data.datasets[0].data = [online, unstable, offline];
    chartInstances.donut.update();
  }
}

// Make deletePortal available globally
window.deletePortal = deletePortal;
