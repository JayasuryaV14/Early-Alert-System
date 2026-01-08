document.getElementById("addPortalBtn").onclick = () => {
  const name = prompt("Enter Portal Name");
  const url = prompt("Enter Portal URL");

  if (!name || !url) return;

  const row = document.createElement("div");
  row.className = "row";
  row.innerHTML = `
    <div>
      <strong>${name}</strong><br>
      <small>${url}</small>
    </div>
    <span class="status online">ONLINE</span>
  `;
  document.getElementById("portalList").appendChild(row);

  updateCounts();
};

function updateCounts() {
  const rows = document.querySelectorAll(".row");
  document.getElementById("total").innerText = rows.length;
  document.getElementById("online").innerText = rows.length;
  document.getElementById("offline").innerText = 0;
  document.getElementById("unstable").innerText = 0;
}
