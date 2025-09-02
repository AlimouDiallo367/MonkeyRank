// Récupère le pseudo depuis l'URL (/user/:pseudo)
const pathParts = window.location.pathname.split('/');
const pseudo = pathParts[2];

document.getElementById("user-pseudo").textContent = pseudo;

const tbody = document.getElementById("user-scores-body");
const loading = document.querySelector(".loading");
const error = document.querySelector(".error");

async function loadUserScores() {
  loading.classList.remove("hidden");
  error.classList.add("hidden");
  tbody.innerHTML = "";

  try {
    const res = await fetch(`/user/${pseudo}/scores`);
    if (!res.ok) throw new Error("Erreur serveur");
    const data = await res.json();

    data.forEach((entry, i) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${i + 1}</td>
        <td>${entry.wpm.toFixed(2)}<div class="sub">${entry.accuracy.toFixed(2)}%</div></td>
        <td>${entry.raw.toFixed(2)}<div class="sub">${entry.consistency.toFixed(2)}%</div></td>
        <td>${new Date(entry.created_at).toLocaleString("fr-FR")}</td>
      `;
      tbody.appendChild(tr);
    });
  } catch (e) {
    error.classList.remove("hidden");
  } finally {
    loading.classList.add("hidden");
  }
}

loadUserScores();
