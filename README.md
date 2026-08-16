# Pokedex Pratice

## Visão Geral

Uma aplicação web interativa de Pokédex que permite pesquisar, navegar e visualizar detalhes de Pokémon. O projeto consome a PokeAPI para exibir informações dos primeiros 649 Pokémon (até a 5ª geração, dos jogos Black/White e Black 2/White 2), com navegação por setas, busca por nome/número e visualização de sprites animados frontais e traseiros.

## Objetivo

Projeto de prática para demonstração de consumo de APIs externas, manipulação DOM e interações de frontend. Serve como exemplo de aplicação com cliente leve sem dependências de build complexas.

## Pré-requisitos

- Navegador web moderno (Chromium, Firefox, Safari)
- Conexão com internet para consumo da [PokeAPI](https://pokeapi.co)

## Instalação

Nenhuma instalação necessária. Basta abrir o `index.html` em um navegador ou hospedar os arquivos em qualquer servidor web estático.

```bash
# Para visualizar localmente
open index.html
# ou arraste o arquivo para o navegador
```

## Configuração do Ambiente Local

Este é um projeto frontend estático. Para rodar localmente:

1. Clone o repositório ou baixe os arquivos
2. Abra o `index.html` diretamente no navegador
3. Ou utilize a extensão "Live Server" VS Code para preview com recarga automática

## Como utilizar

1. Utilize o campo de busca para digitar o nome ou número do Pokémon
2. Use as botões para navegar entre Pokémon anteriores e próximos
3. Clique no Pokémon para alternar entre sprites frontais e traseiros
4. Pressione `Shift` + clique para alternar entre sprites *shiny* e padrão
5. Pressione `Alt` + clique para alternar entre formas alternativas do Pokémon (se houver)

## Build e Validação

Este projeto não possui etapa de build formal. Os arquivos JavaScript e CSS são entregues como fonte. Para validação verifique se os elementos HTML estão corretos no DOM.

## Conteinerização

Não aplicável. Este é um projeto de frontend estático sem configuração Docker.

## Deploy

Não há processo de deploy automatizado definido neste projeto. Como aplicação de frontend estático, pode ser implantado em:

- GitHub Pages
- Vercel
- Netlify

## Troubleshooting

| Problema | Solução |
|----------|---------|

| Pokémon não carrega | Verifique a conexão com internet, a PokeAPI pode estar temporariamente indisponível |
| Botões não funcionam | Recarregue a página, o Pokémon inicial é escolhido aleatoriamente |
| Gradiente do título não aparece | A classe aleatória é aplicada automaticamente ao carregar |
| Erro CORS | Este projeto consome API pública sem configuração CORS específica |

## Contribuição

Sinta-se à vontade para fork este projeto e abrir issues com melhorias ou correções. Áreas para expansão futura:

- Adicionar mais sprites e animações
- Implementar filtros (por tipo, estágio evolutivo, geração)
- Adicionar informações de stats de Pokémon
- Suporte a modo escuro

---

*Projeto de prática com foco em consumo de APIs e manipulação do DOM.*
