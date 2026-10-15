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

Execute `npm run lint` e `npm run build` antes de publicar. O CI verifica o lint de
todas as fontes, a correspondência entre o build e `estudar/` e as regressões de
acessibilidade em `tests/estudar-accessibility.spec.js` (executadas pela raiz).

Módulos `.tsx` de UI exportam apenas componentes para manter o Fast Refresh.
Funções de variantes ficam em `components/ui/*-variants.ts`; hooks e contextos de
formulário e sidebar ficam em `hooks/use-form-field.ts` e `hooks/use-sidebar.ts`.
Importe esses auxiliares diretamente dos respectivos módulos.

O build em `dist/` inclui entradas HTML para os 13 verbetes e 9 leituras. Cada uma possui título, descrição e endereço canônico próprios. Os links e imagens usam o prefixo `/estudar/`. O conteúdo interativo exige JavaScript.

## Publicação no repositório anavanzin

As fontes ficam em `apps/estudar/` e são excluídas do site pela política de publicação existente. O diretório `estudar/` na raiz contém o build estático rastreado.

Para atualizar a publicação, execute o build e copie o conteúdo de `dist/` para `../../estudar/`, removendo apenas assets antigos desse diretório. Depois revise e faça commit das fontes e do bundle. A Cloudflare Pages publica a branch `main` pelo build do site, `npm run build:pages`, que inclui todo o acervo existente.

As imagens foram comprimidas para publicação. Os originais de trabalho permanecem no projeto de origem e não integram o bundle público. Os exercícios são instrumentos didáticos; o classificador jurídico inclui links para as fontes oficiais dos exemplos.

## Coleção de modelos de anotação

O catálogo em `src/data/noteTemplates.json` alimenta a prévia e a cópia para o Craft. As versões A4 e Markdown ficam em `public/templates/` e são incluídas no build estático.

Depois de alterar o catálogo, regenere os arquivos com `python3 scripts/generate_note_templates.py` antes de executar `npm run build`. O gerador requer ReportLab e uma das fontes descritas no início do script. A coletânea reúne as seis folhas sem capa, uma página A4 por modelo.

A cópia oferece conteúdo formatado e texto simples; se o navegador bloquear a área de transferência, a interface seleciona o texto para cópia manual. Os arquivos `.md` também podem ser importados no Craft. Nenhum conteúdo preenchido é enviado a um servidor.
