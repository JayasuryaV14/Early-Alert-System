let timer;

function startMonitoring() {
  const url = document.getElementById("url").value;
  if (!url) return alert("Enter a target");

  timer = setInterval(async () => {
    const start = performance.now();

    let status = "ONLINE";
    let packetLoss = Math.floor(Math.random() * 4);
    let ping = Math.floor(Math.random() * 150) + 20;

    try {
      await fetch("https://" + url, { mode: "no-cors" });
    } catch {
      status = "OFFLINE";
      packetLoss = 100;
    }

    const response = Math.floor(performance.now() - start);

    document.getElementById("ping").innerText = ping;
    document.getElementById("response").innerText = response;
    document.getElementById("packetLoss").innerText = packetLoss;
    document.getElementById("status").innerText = status;

    const log = document.getElementById("log");
    log.innerHTML += `<p>${new Date().toLocaleTimeString()} | ${status} | Ping ${ping}ms | Resp ${response}ms | Loss ${packetLoss}%</p>`;

    if (status === "OFFLINE" || response > 1000 || packetLoss > 5) {
      document.getElementById("statusBox").style.background = "#ff4c4c";
      sendAlert(url, ping, response, packetLoss, status);
    } else {
      document.getElementById("statusBox").style.background = "#0f9b0f";
    }

  }, 3000);
}

function stopMonitoring() {
  clearInterval(timer);
}

function sendAlert(target, ping, response, loss, status) {
  fetch("http://localhost:5000/api/monitor/log", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({ target, ping, response, loss, status, time: new Date().toLocaleTimeString() })
  });
}
