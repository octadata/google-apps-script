# CONSULTAR\_CEP - Função personalizada para Google Sheets

## Descrição

A função `CONSULTAR_CEP` permite consultar informações sobre um CEP diretamente no Google Sheets utilizando a API do [BrasilAPI](https://brasilapi.com.br/). Os dados são armazenados em cache para otimizar as consultas e reduzir chamadas repetitivas à API.

## Como Usar

1. Copie todo o código do arquivo [script.gs](https://github.com/octadata/google-apps-script/blob/main/consultar_cep/script.gs)
2. Na sua planilha Google, vá em Extensões > Apps Script
3. Cole o código, salve e execute para conceder as permissões.

Agora é só seguir as orientações abaixo e utilizar a nova função de consulta de CEP diretamente na sua planilha.

```excel
=CONSULTAR_CEP(cep; itens)
```

### Parâmetros

- `cep` *(string)*: O CEP a ser consultado. Pode ser informado com ou sem o traço.
- `itens` *(opcional, string)*: Lista de itens da resposta que devem ser retornados, passados como uma única string separada por vírgulas. Se não for especificado, retornará os valores padrão: `street` (logradouro), `neighborhood` (bairro), `city` (cidade) e `state` (estado).

### Exemplo de Uso

**Consultar um CEP sem especificar itens:**

```excel
=CONSULTAR_CEP("01304900")
```

**Retorno esperado:**

```
Rua Augusta 1118, Consolação, São Paulo, SP
```

**Consultar um CEP especificando itens:**

```excel
=CONSULTAR_CEP("01304900"; "street, city, latitude, longitude")
```

**Retorno esperado:**

```
Rua Augusta 1118, São Paulo, -23.5541135, -46.6560559
```

## Estrutura da Resposta

A função retorna os valores dos itens especificados, separados por vírgula. Se um item solicitado não existir na resposta, ele será substituído por "N/A".

### Campos Disponíveis

- `cep` - Código de Endereçamento Postal
- `state` - Estado (UF)
- `city` - Cidade
- `neighborhood` - Bairro
- `street` - Logradouro
- `service` - Serviço utilizado para a busca
- `latitude` - Latitude do local (se disponível)
- `longitude` - Longitude do local (se disponível)

## Tratamento de Erros

- Caso o CEP não seja encontrado, a função retorna "CEP não encontrado.".
- Se houver falha na consulta à API, a função retorna "Erro".
- O cache armazena os dados por **6 horas** (21600 segundos) para evitar consultas repetitivas desnecessárias.

## Observações

- A função pode levar alguns segundos para retornar o resultado devido à latência da API e tentativas de reconexão em caso de falhas.
- Caso a API do BrasilAPI esteja indisponível, a consulta não será realizada com outra fonte de dados.
- O argumento `itens` deve ser passado como uma string separada por vírgulas (exemplo: `"street, city, latitude"`).

## Autor

Criado e publicado no [Blog da Octadata](https://octadata.com.br) 🚀
