// ==UserScript==
// @name         MonkeyRank observer
// @namespace    https://github.com/AlimouDiallo367/MonkeyRank
// @version      1.0
// @description  Envoie automatiquement les résultats de Monkeytype à MonkeyRank
// @author       DeltaGarnet & AlimouDiallo367
// @match        https://monkeytype.com/*
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  function showToast(msg) {
    let toast = document.createElement("div");
    toast.textContent = msg;
    Object.assign(toast.style, {
      position: "fixed",
      bottom: "30px",
      right: "30px",
      background: "#313336",
      color: "#f5f5f5",
      padding: "12px 20px",
      borderRadius: "8px",
      fontFamily: "'JetBrains Mono', monospace, sans-serif",
      fontSize: "20px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.6)",
      opacity: "0",
      transition: "opacity 0.4s ease, transform 0.4s ease",
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
    }, 2200);
    setTimeout(() => {
      toast.remove();
    }, 3000);
  }

  function getPrenom() {
    let saved = localStorage.getItem("prenom");
    if (saved) return saved;
    let entered = prompt("Entre ton prénom pour MonkeyRank :");
    if (entered) {
      localStorage.setItem("prenom", entered.trim());
      return entered.trim();
    }
    return "Inconnu";
  }

  function collectResult() {
    let get = (sel) => {
      let el = document.querySelector(sel);
      return el ? el.getAttribute("aria-label") : null;
    };
    let wpm = get(".group.wpm .bottom");
    let raw = get(".group.raw .bottom");
    let acc = get(".group.acc .bottom");
    let cons = get(".group.consistency .bottom");
    let time = get(".group.time .bottom");
    let idEl = document.querySelector(
      ".textButton.editTagsButton[data-result-id]"
    );
    let id = idEl ? idEl.getAttribute("data-result-id") : null;
    if (time) time = time.split(" ")[0];
    return { wpm, raw, acc, cons, time };
  }

  function sendToBackend(score) {
    let prenom = getPrenom();
    fetch("http://localhost:4567/scores", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prenom: prenom,
        wpm: parseFloat(score.wpm),
        accuracy: parseFloat(score.acc),
        raw: parseFloat(score.raw),
        consistency: parseFloat(score.cons),
        time: score.time,
        mode: score.mode,
        id: score.id,
      }),
    })
      .then((res) => res.json())
      .then((resp) => {
        console.log("Réponse API:", resp);
        showToast("Score envoyé pour " + prenom + " : " + score.wpm);
      })
      .catch((err) => {
        console.error("Erreur:", err);
        showToast("Erreur lors de l'envoi ❌");
      });
  }

  function monitorResult() {
    let resultVisible = false;
    const r = document.getElementById("result");
    if (r) {
      const observer = new MutationObserver(() => {
        const currentlyVisible = !r.classList.contains("hidden");
        if (currentlyVisible && !resultVisible) {
          sendToBackend(collectResult());
        }
        resultVisible = currentlyVisible;
      });

      observer.observe(r, { attributes: true, attributeFilter: ["class"] });
    }
  }

  monitorResult();
})();
