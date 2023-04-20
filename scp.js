window.onload = function(){
  // var refreshBtn = document.getElementById("refreshBtn");
  
  // refreshBtn.addEventListener("click", botaoClicado); 
  
  // function botaoClicado(){
  //   console.log("botao clicado")
  // }

  //faz uma solicitação GET para a API Dragon para pegar os dados de um campeão aleatório
  axios.get('https://ddragon.leagueoflegends.com/cdn/13.8.1/data/pt_BR/champion.json')
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
    axios.get(`https://ddragon.leagueoflegends.com/cdn/13.8.1/data/pt_BR/item.json?tags=${championType}`)
    .then(function (response) { 
        // pega o objeto com info sobre os itens
        const items = response.data.data;
        
        // pega uma lista com os nomes dos itens
        const itemNames = Object.keys(items);

        // seleciona aleatoriamente seis ids
        const randomItemIds = [];
        for (let i = 0; i < 6; i++) {
            randomItemIds.push(itemNames[Math.floor(Math.random() * itemNames.length)]);
        }

        //cria um objeto com as info dos campeões e itens selecionados
        const championData = {
          name: randomChampionName,
          splashArt: `http://ddragon.leagueoflegends.com/cdn/img/champion/splash/${randomChampionImage}_0.jpg`,
          build: randomItemIds,
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

//http://ddragon.leagueoflegends.com/cdn/img/champion/splash/Aatrox_0.jpg