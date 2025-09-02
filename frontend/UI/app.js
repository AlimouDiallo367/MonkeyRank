async function loadLeaderboard() {
  const tbody = document.getElementById('leaderboard-body');
  const loading = document.querySelector('.loading');
  const error = document.querySelector('.error');

  loading.classList.remove('hidden');
  error.classList.add('hidden');
  tbody.innerHTML = '';

  try {
    const res = await fetch('/scores');
    if (!res.ok) throw new Error("Réponse serveur invalide");
    const data = await res.json();

    data.forEach((entry, i) => {
      let rankDisplay;
      if (i === 0) {
        rankDisplay = '<i class="fas fa-crown" style="color:#facc15;"></i>'; // or (jaune)
      } else if (i === 1) {
        rankDisplay = '<i class="fas fa-medal" style="color:#9ca3af;"></i>'; // argent (gris)
      } else if (i === 2) {
        rankDisplay = '<i class="fas fa-medal" style="color:#d97706;"></i>'; // bronze (orange)
      } else {
        rankDisplay = i + 1;
      }

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${rankDisplay}</td>
        <td>
          <div class="avatarNameBadge">
            <div class="avatar"><div class="userIcon"><i class="fas fa-user-circle"></i></div></div>
            <div class="name">${entry.pseudo}</div>
          </div>
        </td>
        <td>${entry.wpm.toFixed(2)}<div class="sub">${entry.accuracy.toFixed(2)}%</div></td>
        <td>${entry.raw.toFixed(2)}<div class="sub">${entry.consistency.toFixed(2)}%</div></td>
        <td>${new Date(entry.created_at).toLocaleString('fr-FR')}</td>
      `;
      tbody.appendChild(tr);
    });
  } catch (e) {
    error.classList.remove('hidden');
  } finally {
    loading.classList.add('hidden');
  }
}

loadLeaderboard();
setInterval(loadLeaderboard, 30000); // refresh every 30s
