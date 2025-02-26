/**
 * Função personalizada para consultar um CEP usando a API do BrasilAPI.
 * Criado e publicado no Blog da Octadata: https://octadata.com.br/blog/como-consultar-cep-no-google-sheets/
 * 
 * @param {string} cep O CEP a ser consultado.
 * @param {Array} [itens] Um array contendo os itens da resposta a serem retornados.
 * @return {string} Os valores dos itens da resposta, separados por vírgula ou "Erro" em caso de falha.
 * @customfunction
 */

function CONSULTAR_CEP(cep, itens) {
  // Remove o traço, se existir
  cep = String(cep)?.replace("-", "");

  // Adiciona zeros à esquerda se o CEP tiver menos de 8 dígitos
  if (cep.length < 8) {
    cep = cep.padStart(8, '0');
  }

  var cache = CacheService.getScriptCache();
  var cachedData = cache.get(cep);

  // Se o dado estiver em cache, reutiliza o resultado
  var data;
  if (cachedData) {
    data = JSON.parse(cachedData);
  } else {
    var url = 'https://brasilapi.com.br/api/cep/v2/' + cep;
    var response;
    var attempts = 0;
    var success = false;

    // Faz até 10 tentativas para obter uma resposta com status HTTP 200
    while (attempts < 10 && !success) {
      try {
        response = UrlFetchApp.fetch(url);
        if (response.getResponseCode() === 200) {
          success = true;
        } else {
          attempts++;
          Utilities.sleep(1000);
        }
      } catch (e) {
        attempts++;
        Utilities.sleep(1000);
      }
    }

    if (!success) {
      return "Erro";
    }

    data = JSON.parse(response.getContentText());

    if (!data.cep) {
      return "CEP não encontrado.";
    }

    // Armazena a resposta no cache pelo tempo máximo (21600 segundos/6 horas)
    cache.put(cep, JSON.stringify(data), 21600);
  }

  // Se os itens não forem especificados, usa os padrões
  if (!itens || itens.trim() === "") {
    itens = "street, neighborhood, city, state";
  }

  // Converte a string de itens em um array, removendo espaços extras
  var itensArray = itens.split(",").map(function(item) {
    return item.trim();
  });

  // Retorna os valores dos itens desejados
  var resultado = itensArray.map(function(item) {
    if (item === "latitude") {
      return data.location && data.location.coordinates && data.location.coordinates.latitude 
        ? data.location.coordinates.latitude 
        : "N/A";
    } else if (item === "longitude") {
      return data.location && data.location.coordinates && data.location.coordinates.longitude 
        ? data.location.coordinates.longitude 
        : "N/A";
    } else {
      return data[item] || "N/A";
    }
  });

  return resultado.join(", ");
}
