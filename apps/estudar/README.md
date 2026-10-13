# Estudar — Método

Acervo de técnicas de estudo, gramática, etimologia e leituras com instrumentos interativos, publicado em https://anavanzin.com/estudar/.

## Desenvolvimento

Requer Node.js 22 ou superior.

```sh
npm ci
npm run dev
npm run build
```

O servidor abre a rota `/estudar/`. O conteúdo fica em `src/config.ts` e `src/data/libraryDocs.ts`; as imagens publicadas ficam em `public/images/`.

O build em `dist/` inclui entradas HTML para os 13 verbetes e 9 leituras. Cada uma possui título, descrição e endereço canônico próprios. Os links e imagens usam o prefixo `/estudar/`. O conteúdo interativo exige JavaScript.

## Publicação no repositório anavanzin

As fontes ficam em `apps/estudar/` e são excluídas do site pela política de publicação existente. O diretório `estudar/` na raiz contém o build estático rastreado.

Para atualizar a publicação, execute o build e copie o conteúdo de `dist/` para `../../estudar/`, removendo apenas assets antigos desse diretório. Depois revise e faça commit das fontes e do bundle. A Cloudflare Pages publica a branch `main` pelo build do site, `npm run build:pages`, que inclui todo o acervo existente.

As imagens foram comprimidas para publicação. Os originais de trabalho permanecem no projeto de origem e não integram o bundle público. Os exercícios são instrumentos didáticos; o classificador jurídico inclui links para as fontes oficiais dos exemplos.
