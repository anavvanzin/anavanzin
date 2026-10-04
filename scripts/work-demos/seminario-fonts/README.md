# Fontes do Seminário 8

As fontes originais das apresentações são servidas pelo próprio site, sem requisições ao Google Fonts durante a visita. O CSS está em `/seminario8-dever-poder/fonts/fonts.css`; os HTML podem substituir os links de Google Fonts por esse único stylesheet.

Famílias preservadas: Geist, Geist Mono, EB Garamond, Spectral, Caveat, Source Serif 4, Space Grotesk, Playfair Display e JetBrains Mono. Os subsets são `latin` e `latin-ext`. Os pesos e estilos seguem os pedidos dos HTML originais; fontes variáveis recebem o intervalo correspondente. Playfair Display e JetBrains Mono 400–700 reutilizam os arquivos de `/fonts/`; JetBrains Mono 300 é baixada separadamente porque o eixo dos arquivos globais inicia em 400.

O script escreve somente em `seminario8-dever-poder/fonts/`, sem alterar os arquivos globais nem os repositórios dos trabalhos. Não remove arquivos por glob. Requer `fontTools`, disponível no ambiente `iconocracy`.

```bash
/opt/homebrew/Caskroom/miniforge/base/envs/iconocracy/bin/python scripts/work-demos/seminario-fonts/fetch_fonts.py
```

O fetch usa a [API CSS2 oficial do Google Fonts](https://developers.google.com/fonts/docs/css2), baixa os WOFF2 referenciados por ela e preserva as licenças originais de cada família no repositório oficial [google/fonts](https://github.com/google/fonts). Todas as nove famílias são distribuídas sob SIL Open Font License 1.1, conforme os arquivos `OFL-*.txt` baixados. Os arquivos não têm nomes internos ou desenho modificados. `manifest.json` registra URLs, data de obtenção, tamanhos e SHA-256 dos arquivos locais, compartilhados e das licenças.

A execução depende de acesso de rede ao Google Fonts e ao GitHub. O site publicado não depende dessa rede: basta publicar o CSS, WOFF2 e arquivos de licença já gerados. Para conferir integridade e os eixos declarados, o script valida o cabeçalho WOFF2 e a cobertura de peso com `fontTools` antes de gravar o CSS final.
