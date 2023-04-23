//tipos de powerType que existem:
// Fighter, Mage, Assassin, Marksman, Tank, Support

//tipos de itens que existem:
// Boots, ManaRegen, HealthRegen, Health, CriticalStrike, SpellDamage, Mana,
// Armor, SpellBlock, LifeSteal, SpellVamp, Jungle, Damage, Lane, AttackSpeed, 
// OnHit, Trinket, Active, Consumable, Stealth, Vision, CooldownReduction, NonbootsMovement, 
// AbilityHaste, Tenacity, MagicPenetration, ArmorPenetration, Aura, Slow, GoldPer, MagicResist

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

        //tagMapping é um objeto que mapeia os tipos de itens com os tipos de poder
        const tagMapping = {
          "Boots": ["Fighter", "Mage", "Assassin", "Marksman", "Tank", "Support"],
          "ManaRegen": ["Mage", "Support"],
          "HealthRegen": ["Fighter", "Tank", "Support"],
          "Health": ["Fighter", "Tank"],
          "CriticalStrike": ["Marksman","Fighter","Assassin"],
          "SpellDamage": ["Mage", "Support"],
          "Mana": ["Mage"],
          "Armor": ["Fighter", "Tank"],
          "SpellBlock": ["Fighter", "Tank"],
          "LifeSteal": ["Fighter", "Marksman"],
          "SpellVamp": ["Mage"],
          "Jungle": ["Fighter", "Mage", "Assassin", "Marksman", "Tank"],
          "Damage": ["Fighter", "Assassin", "Marksman","Tank"],
          "Lane": ["Fighter", "Assassin", "Marksman"],
          "AttackSpeed": ["Marksman","Fighter","Assassin"],
          "OnHit": ["Marksman", "Fighter", "Assassin", "Tank"],
          "Trinket": ["Fighter", "Mage", "Assassin", "Marksman", "Tank", "Support"],
          "Active": ["Fighter", "Mage", "Assassin", "Marksman", "Tank", "Support"],
          "Consumable": ["Fighter", "Mage", "Assassin", "Marksman", "Tank", "Support"],
          "Stealth": ["Assassin"],
          "Vision": ["Support"],
          "CooldownReduction": ["Mage", "Support", "Fighter", "Assassin", "Marksman", "Tank"],
          "NonbootsMovement": ["Fighter", "Mage", "Assassin", "Marksman", "Tank", "Support"],
          "AbilityHaste": ["Mage", "Support", "Fighter", "Assassin", "Marksman", "Tank"],
          "Tenacity": ["Fighter", "Tank", "Support"],
          "MagicPenetration": ["Mage"],
          "ArmorPenetration": ["Fighter", "Assassin", "Marksman"],
          "Aura": ["Tank", "Support"],
          "Slow": ["Fighter", "Mage", "Assassin", "Marksman", "Tank", "Support"],
          "GoldPer": ["Support"],
          "MagicResist": ["Fighter", "Tank"]
        };         

        const tagMappingKeys = Object.keys(tagMapping); //pega as keys do objeto tagMapping
        const availableTags = tagMappingKeys.filter(tag => tagMapping[tag].includes(championType)); //filtra as keys do objeto tagMapping para pegar apenas as que tem o tipo de poder do campeão
        const allTags = Object.keys(items).map(item => items[item].tags).flat(); //pega todas as tags dos itens e transforma em um array
        const build = []; //array que vai guardar os itens da build


        //tentativa falha de fazer a construção da build por frequencia de tags (ver depois)
        // const tagFrequency = {}; //objeto que vai guardar a frequencia de cada tag
        // allTags.forEach(tag => { 
        //   if (availableTags.includes(tag)) { 
        //     tagFrequency[tag] = (tagFrequency[tag] || 0) + 1; 
        //   } 
        // });

        const randomNumbers = []; //array que vai guardar os números aleatórios
        for (let i = 0; i < 6; i++) { //gera 6 números aleatórios
          randomNumbers.push(Math.random()); 
        }

        randomNumbers.forEach(number => { //percorre o array de números aleatórios
          const tagPercentages = {}; //objeto que vai guardar a porcentagem de cada tag
          availableTags.forEach(tag => { //percorre o array de tags disponíveis
            const filteredItems = Object.keys(items) //pega as keys do objeto items
              .filter(item => !items[item].requiredAlly || items[item].requiredAlly !== "Ornn") //filtra os itens que não precisam de um campeão específico
              .filter(item => items[item].gold.total > 2400) //filtra os itens que custam mais de 2400 de ouro
              .filter(item => items[item].tags.includes(tag)); //filtra os itens que tem a tag atual
            const percentage = filteredItems.length / Object.keys(items).length; //calcula a porcentagem de itens que tem a tag atual
            tagPercentages[tag] = percentage; //adiciona a porcentagem no objeto tagPercentages
          });

          const highestPercentage = Math.max(...Object.values(tagPercentages));  //pega a maior porcentagem
          const highestPercentageTag = Object.keys(tagPercentages).find(tag => tagPercentages[tag] === highestPercentage); //pega a tag que tem a maior porcentagem
          const itemsWithHighestPercentageTag = Object.keys(items) //pega as keys do objeto items
            .filter(item => items[item].tags.includes(highestPercentageTag))  //filtra os itens que tem a tag com a maior porcentagem
            .filter(item => !items[item].requiredAlly || items[item].requiredAlly !== "Ornn") //filtra os itens que não precisam de um campeão específico
            .filter(item => items[item].gold.total > 2400) //filtra os itens que custam mais de 2400 de ouro
          const randomItem = itemsWithHighestPercentageTag[Math.floor(Math.random() * itemsWithHighestPercentageTag.length)]; //pega um item aleatório que tem a tag com a maior porcentagem

          const expensiveItems = Object.keys(items) //pega as keys do objeto items
            .filter(item => items[item].gold.total > 2400) //filtra os itens que custam mais de 2400 de ouro
            .filter(item => !items[item].requiredAlly || items[item].requiredAlly !== "Ornn") //filtra os itens que não precisam de um campeão específico
          const randomExpensiveItem = expensiveItems[Math.floor(Math.random() * expensiveItems.length)]; //pega um item aleatório que custa mais de 2400 de ouro

          build.push(number > 0.5 ? randomItem : randomExpensiveItem); //adiciona o item aleatório na build
        });

        //ver depois (para colocar uma bota na build)
        // const boots = Object.keys(items).filter(item => items[item].tags.includes("Boots")); 
        // const randomBoots = boots[Math.floor(Math.random() * boots.length)];
        // build.push(randomBoots);

        //adiciona imagem nos itens
        const buildImages = document.querySelectorAll(".build img");
        buildImages.forEach((image, index) => {
          image.src = `http://ddragon.leagueoflegends.com/cdn/${version}/img/item/${build[index]}.png`;
          image.alt = items[build[index]].name;
        });

        //cria um objeto com os dados do campeão
        const championData = {
          name: randomChampionName,
          splashArt: `http://ddragon.leagueoflegends.com/cdn/img/champion/splash/${randomChampionImage}_0.jpg`,
          build: build.map(item => items[item]),
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
