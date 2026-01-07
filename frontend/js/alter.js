setInterval(() => {
  const time = new Date().toLocaleTimeString();

  const online = Math.random() > 0.25;
  const ping = Math.floor(Math.random() * 120) + 20; // 20–140ms
  const packetLoss = online ? Math.floor(Math.random() * 5) : 100;

  if (online) {
    logs.innerHTML += `
      <p>✅ ${time} | Status: Online | Ping: ${ping} ms | Packet Loss: ${packetLoss}%</p>
    `;
  } else {
    logs.innerHTML += `
      <p style="color:red;">❌ ${time} | Status: Offline | Ping: Timeout | Packet Loss: 100%</p>
    `;
    alerts.innerHTML += `<p>🚨 OUTAGE detected at ${time}</p>`;
  }
}, 3000);
