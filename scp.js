window.onload = function(){
  var refreshBtn = document.getElementById("refreshBtn");
  var version;
  refreshBtn.addEventListener("click", getChampionData); 

  //promise para pegar a ultima versão do jogo e aplicar em uma variavel para ser colocada nos links para não precisar mudar manualmente
  //explicação do que é promise:
  //promise é uma função que retorna um objeto que representa o sucesso ou falha de uma operação assíncrona
  //tive que fazer promise porque a variavel tinha que estar pronta antes de ser usada
  function getVersion() {
    return new Promise(function(resolve, reject) {
      axios.get('https://ddragon.leagueoflegends.com/api/versions.json').then(function (response) {
        version = response.data[0];
        resolve(version);
      })
      .catch(function (error) {
        console.log(error);
        reject(error);
      });
    });
  }

  getVersion().then(function(version) {
    //esse código só é executado depois que a Promise é resolvida
    console.log('Versão:', version);
    getChampionData();
  })
  .catch(function(error) {
    console.log(error);
  });  

  function getChampionData() {
  //faz uma solicitação GET para a API Dragon para pegar os dados de um campeão aleatório
  axios.get(`https://ddragon.leagueoflegends.com/cdn/${version}/data/pt_BR/champion.json`)
  .then(function (response) {
      // pega o objeto com info sobre os campeões
    const champions = response.data.data;

    // pega uma lista com os nomes dos campeões
    const championNames = Object.keys(champions);

    // seleciona aleatoriamente um nome de campeão
    const randomChampionName = championNames[Math.floor(Math.random() * championNames.length)];

    // pega as info sobre o campeão selecionado
    const randomChampion = champions[randomChampionName];

    // pega a imagem do campeão
    var randomChampionImage = randomChampion.image.full;
    //remove o ".png" do nome da imagem por causa de um erro que estava gerando no link que recebia o jpg
    randomChampionImage = randomChampionImage.slice(0, -4);

    // pega o tipo de poder do campeão (ap, ad, tank,etc)
    const championType = randomChampion.tags[0];

    // faz uma solicitação GET para a API pra ter informações sobre build de acordo com o tipo de poder do campeão
    axios.get(`https://ddragon.leagueoflegends.com/cdn/${version}/data/pt_BR/item.json?tags=${championType}`)
    .then(function (response) { 
        // pega o objeto com info sobre os itens
        const items = response.data.data; 
        
        //cria um objeto com as info dos campeões e itens selecionados
        const championData = {
          name: randomChampionName,
          splashArt: `http://ddragon.leagueoflegends.com/cdn/img/champion/splash/${randomChampionImage}_0.jpg`,
          build: "wip",
          powerType: championType
        };

        //exibe no console o que foi pego
        console.log(championData);
          // código para atualizar a imagem da splash art
      var championImage = document.getElementById("splashArt");
      championImage.src = `http://ddragon.leagueoflegends.com/cdn/img/champion/splash/${randomChampionImage}_0.jpg`
      championImage.alt = randomChampionName;

    })
    .catch(function (error) { // em caso de erro, exibe no console
        console.log(error);
    });
  })
  .catch(function (error) { //em caso de erro, exibe no console
      console.log(error);
  });
}
} // fim da função getChampionData
