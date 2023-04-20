window.onload = function(){
  var refreshBtn = document.getElementById("refreshBtn");
  
  refreshBtn.addEventListener("click", botaoClicado); 
  
  function botaoClicado(){
    console.log("botao clicado")
  }
}
