javascript:(function(){
  function showToast(msg){
    let toast=document.createElement("div");
    toast.textContent=msg;
    Object.assign(toast.style,{
      position:"fixed",
      bottom:"30px",
      right:"30px",
      background:"#313336",
      color:"#f5f5f5",
      padding:"16px 24px",
      borderRadius:"10px",
      fontFamily:"'JetBrains Mono', monospace, sans-serif",
      fontSize:"20px",
      boxShadow:"0 4px 12px rgba(0,0,0,0.6)",
      opacity:"0",
      transition:"opacity 0.5s ease, transform 0.5s ease",
      zIndex:"9999",
      pointerEvents:"none"
    });
    document.body.appendChild(toast);
    requestAnimationFrame(()=>{toast.style.opacity="1";toast.style.transform="translateY(-8px)";});
    setTimeout(()=>{toast.style.opacity="0";toast.style.transform="translateY(0)";},2500);
    setTimeout(()=>{toast.remove();},3200);
  }

  function onResultPage(){
    function get(sel){let el=document.querySelector(sel);return el?el.getAttribute("aria-label"):null;}
    let wpm=get(".group.wpm .bottom");
    let raw=get(".group.raw .bottom");
    let acc=get(".group.acc .bottom");
    let cons=get(".group.consistency .bottom");
    let time=get(".group.time .bottom"); if(time){time=time.split(" ")[0];}
    let idEl=document.querySelector(".textButton.editTagsButton[data-result-id]");
    let id=idEl?idEl.getAttribute("data-result-id"):null;
    return{page:"result",wpm,raw,acc,cons,time,id};
  }

  function onProfilePage(){
    let rows=document.querySelectorAll("tr.resultRow"),results=[];
    rows.forEach(tr=>{
      let tds=tr.querySelectorAll("td");
      if(tds.length){
        let idBtn=tr.querySelector("button[data-result-id]");
        results.push({
          wpm:tds[1]?.innerText.trim(),
          raw:tds[2]?.innerText.trim(),
          acc:tds[3]?.innerText.trim(),
          cons:tds[4]?.innerText.trim(),
          mode:tds[6]?.innerText.trim(),
          date:tds[tds.length-1]?.innerText.trim(),
          id:idBtn?idBtn.getAttribute("data-result-id"):null
        });
      }
    });
    return{page:"profile",results};
  }

  function sendToBackend(score){
    fetch("http://localhost:4567/scores",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({
        pseudo:"TestUser",
        wpm:parseFloat(score.wpm),
        accuracy:parseFloat(score.acc),
        raw:parseFloat(score.raw),
        consistency:parseFloat(score.cons)
      })
    })
    .then(res=>res.json())
    .then(resp=>{
      console.log("Réponse API:",resp);
      showToast("Score envoyé ✅");
    })
    .catch(err=>{
      console.error("Erreur:",err);
      showToast("Erreur lors de l'envoi ❌");
    });
  }

  let r=document.getElementById("result"),data;
  if(r && !r.classList.contains("hidden")){
    data=onResultPage();
    console.log("Collected:",data);
    showToast("Résultat enregistré : "+data.wpm);
    sendToBackend(data);
  }
  else if(r && r.classList.contains("hidden") && document.querySelector(".allBadges")){
    data=onProfilePage();
    console.log("Collected:",data);
    showToast("Résultats du profil récupérés");
  }
  else if(r && r.classList.contains("hidden")){
    showToast("Finissez un test pour enregistrer vos résultats");
  }
  else{
    showToast("Page non reconnue");
  }
})();
