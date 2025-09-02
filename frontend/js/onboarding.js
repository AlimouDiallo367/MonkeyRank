// document.addEventListener("DOMContentLoaded", () => {
//   const pseudoInput = document.getElementById("pseudo");
//   const saveBtn = document.getElementById("savePseudo");
//   const feedback = document.getElementById("feedback");

//   // Vérifie si l'utilisateur a déjà un pseudo dans localStorage
//   const storedPseudo = localStorage.getItem("pseudo");
//   if(storedPseudo) pseudoInput.value = storedPseudo;

//   saveBtn.addEventListener("click", async () => {
//     const pseudo = pseudoInput.value.trim();
//     if(!pseudo) {
//       feedback.textContent = "Veuillez entrer un pseudo valide.";
//       feedback.classList.remove("hidden");
//       return;
//     }

//     // Sauvegarde localement
//     localStorage.setItem("pseudo", pseudo);

//     // Optionnel : vérifie si ce pseudo existe déjà sur ton backend
//     try {
//       const res = await fetch("/user/" + pseudo);
//       if(res.ok) {
//         const data = await res.json();
//         feedback.textContent = `Bienvenue, ${data.pseudo} !`;
//       } else {
//         feedback.textContent = `Pseudo enregistré : ${pseudo}`;
//       }
//     } catch(err) {
//       feedback.textContent = `Pseudo enregistré : ${pseudo} (offline)`;
//     }

//     feedback.classList.remove("hidden");
//   });
// });

document.addEventListener("DOMContentLoaded", () => {
  const pseudoInput = document.getElementById("pseudo");
  const saveBtn = document.getElementById("savePseudo");
  const feedback = document.getElementById("feedback");

  const storedPseudo = localStorage.getItem("pseudo");
  if (storedPseudo) pseudoInput.value = storedPseudo;

  saveBtn.addEventListener("click", () => {
    const pseudo = pseudoInput.value.trim();
    if (!pseudo) {
      feedback.textContent = "Veuillez entrer un pseudo valide.";
      feedback.classList.remove("hidden");
      return;
    }

    localStorage.setItem("pseudo", pseudo);
    window.location.href = "/"; // redirection vers index.html
  });
});
