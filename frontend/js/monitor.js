function startMonitoring() {
  const url = document.getElementById("url").value;
  const log = document.getElementById("log");

  if (!url) {
    alert("Enter a valid address");
    return;
  }

  log.innerHTML += `<p>🔍 Monitoring started for ${url}</p>`;

  setInterval(() => {
    const status = Math.random() > 0.2 ? "ONLINE" : "OFFLINE";
    const response = Math.floor(Math.random() * 200);

    document.getElementById("response").innerText = response;

    if (status === "OFFLINE") {
      log.innerHTML += `<p style="color:red;">🚨 OUTAGE detected at ${new Date().toLocaleTimeString()}</p>`;
      let count = document.getElementById("alertCount");
      count.innerText = parseInt(count.innerText) + 1;
    }
  }, 3000);
}