document.addEventListener("DOMContentLoaded", () => {
  const pseudoInput = document.getElementById("pseudo");
  const saveBtn = document.getElementById("savePseudo");
  const feedback = document.getElementById("feedback");
  const bookmarkletLink = document.getElementById("bookmarkletLink");
  const resetLink = document.getElementById("resetLocalStorage");

  const storedPseudo = localStorage.getItem("pseudo");
  if (storedPseudo) pseudoInput.value = storedPseudo;

  const resetCode = `
    javascript:(function(){
      localStorage.removeItem('prenom');
      alert('Pseudo réinitialisé !');
    })();
    `
    .trim()
    .replace(/\s+/g, " ");
  resetLink.href = resetCode;

  saveBtn.addEventListener("click", () => {
    const pseudo = pseudoInput.value.trim();
    if (!pseudo) {
      feedback.textContent = "Veuillez entrer un pseudo valide.";
      feedback.classList.remove("hidden");
      return;
    }

    localStorage.setItem("pseudo", pseudo);
    feedback.textContent =
      "Pseudo enregistré ! Vous pouvez maintenant ajouter le bookmarklet.";
    feedback.classList.remove("hidden");

    // Activer le lien bookmarklet après validation
    const bookmarkletCode = `
          javascript: (function () {
  function showToast(msg) {
    let toast = document.createElement("div");
    toast.textContent = msg;
    Object.assign(toast.style, {
      position: "fixed",
      bottom: "30px",
      right: "30px",
      background: "#313336",
      color: "#f5f5f5",
      padding: "16px 24px",
      borderRadius: "10px",
      fontFamily: "'JetBrains Mono', monospace, sans-serif",
      fontSize: "20px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.6)",
      opacity: "0",
      transition: "opacity 0.5s ease, transform 0.5s ease",
      zIndex: "9999",
      pointerEvents: "none",
    });
    document.body.appendChild(toast);
    requestAnimationFrame(() => {
      toast.style.opacity = "1";
      toast.style.transform = "translateY(-8px)";
    });
    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(0)";
    }, 2500);
    setTimeout(() => {
      toast.remove();
    }, 3200);
  }

  function getPrenom() {
    if (PRENOM != "") return PRENOM;
    let saved = localStorage.getItem("prenom");
    if (saved) return saved;
    let entered = prompt("Entre ton prénom pour MonkeyRank :");
    if (entered) {
      localStorage.setItem("prenom", entered.trim());
      return entered.trim();
    }
    return "Inconnu";
  }

  function onResultPage() {
    function get(sel) {
      let el = document.querySelector(sel);
      return el ? el.getAttribute("aria-label") : null;
    }
    let wpm = get(".group.wpm .bottom");
    let raw = get(".group.raw .bottom");
    let acc = get(".group.acc .bottom");
    let cons = get(".group.consistency .bottom");
    let time = get(".group.time .bottom");
    if (time) {
      time = time.split(" ")[0];
    }
    let modeEl = document.querySelector(".group.testType .bottom");
    let mode = modeEl ? modeEl.innerText.trim() : null;
    let idEl = document.querySelector(
      ".textButton.editTagsButton[data-result-id]"
    );
    let id = idEl ? idEl.getAttribute("data-result-id") : null;
    return { page: "result", wpm, raw, acc, cons, time, mode, id };
  }

  function onProfilePage() {
    let rows = document.querySelectorAll("tr.resultRow"),
      results = [];
    rows.forEach((tr) => {
      let tds = tr.querySelectorAll("td");
      if (tds.length) {
        let idBtn = tr.querySelector("button[data-result-id]");
        results.push({
          wpm: tds[1]?.innerText.trim(),
          raw: tds[2]?.innerText.trim(),
          acc: tds[3]?.innerText.trim(),
          cons: tds[4]?.innerText.trim(),
          mode: tds[6]?.innerText.trim(),
          date: tds[tds.length - 1]?.innerText.trim(),
          id: idBtn ? idBtn.getAttribute("data-result-id") : null,
        });
      }
    });
    return { page: "profile", results };
  }

  function sendToBackend(score) {
    let prenom = getPrenom();
    let payload;

    if (score.page === "profile" && Array.isArray(score.results)) {
      payload = {
        prenom: prenom,
        ...score,
      };
    } else {
      payload = {
        prenom: prenom,
        wpm: parseFloat(score.wpm),
        accuracy: parseFloat(score.acc),
        raw: parseFloat(score.raw),
        consistency: parseFloat(score.cons),
        time: score.time,
        mode: score.mode,
        page: score.page || "result",
        id: score.id,
      };
    }

    fetch("http://localhost:4567/scores", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((resp) => {
        console.log("Réponse API:", resp);
      })
      .catch((err) => {
        console.error("Erreur:", err);
        showToast("Erreur lors de l'envoi ❌");
      });
  }

  let r = document.getElementById("result"),
    data;
  if (r && !r.classList.contains("hidden")) {
    data = onResultPage();
    console.log("Collected:", data);
    sendToBackend(data);
    showToast("Résultat enregistré : " + data.wpm);
  } else if (
    r &&
    r.classList.contains("hidden") &&
    document.querySelector(".allBadges")
  ) {
    data = onProfilePage();
    console.log("Collected:", data);
    sendToBackend(data);
    showToast("Résultats du profil enregistrés");
  } else if (r && r.classList.contains("hidden")) {
    showToast("Finissez un test pour enregistrer vos résultats");
  } else {
    showToast("Page non reconnue");
  }
})();

        `
      .trim()
      .replace(/\s+/g, " ");

    bookmarkletLink.href = bookmarkletCode;
    bookmarkletLink.style.display = "inline-block";
  });
});
