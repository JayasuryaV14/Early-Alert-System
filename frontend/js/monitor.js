let monitoringInterval;
let monitoring = false;

function startMonitoring() {
  if (monitoring) return;

  const target = document.getElementById("url").value;
  const log = document.getElementById("log");
  const alerts = document.getElementById("alerts");

  if (!target) {
    alert("Please enter a website or IP address");
    return;
  }

  monitoring = true;
  log.innerHTML += `<p>🔍 Monitoring started for <b>${target}</b></p>`;

  monitoringInterval = setInterval(() => {

    const ping = Math.floor(Math.random() * 1600) + 50;
    const response = Math.floor(Math.random() * 1200) + 100;
    const loss = Math.random() > 0.9 ? 100 : Math.floor(Math.random() * 6);

    document.getElementById("ping").innerText = ping;
    document.getElementById("response").innerText = response;
    document.getElementById("loss").innerText = loss;

    let serverStatus = "ONLINE";
    let networkStatus = "NORMAL";

    if (ping > 1500 || response > 1000 || loss > 5) {
      serverStatus = "OFFLINE";
      networkStatus = "CRITICAL";
    }
    else if (ping > 300 || response > 800 || loss > 1) {
      networkStatus = "SLOW";
    }

    document.getElementById("status").innerText = "Server: " + serverStatus;

    const time = new Date().toLocaleTimeString();

    if (serverStatus === "OFFLINE") {
      log.innerHTML += `<p style="color:red;">🚨 ${time} - OUTAGE DETECTED</p>`;
      alerts.innerHTML += `<p>⚠️ ${time} - Service Down</p>`;
    } else {
      log.innerHTML += `<p>✅ ${time} - Healthy (${networkStatus})</p>`;
    }

    log.scrollTop = log.scrollHeight;
    alerts.scrollTop = alerts.scrollHeight;

  }, 3000);
}

function stopMonitoring() {
  clearInterval(monitoringInterval);
  monitoring = false;

  document.getElementById("log").innerHTML += `<p>⛔ Monitoring stopped</p>`;
}
