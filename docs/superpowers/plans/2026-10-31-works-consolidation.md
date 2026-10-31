# Local research/work consolidation

Canonical index: `/trabalhos/`, title “Pesquisa e trabalhos” / “Research and works”.
The source contained 14 work/resource records and five publication records. Only
the Lacchè translation overlapped. Keep its richer linked work record, not the
unlinked publication duplicate. Result: 18 records/resources, not 18 publications.

- Published writing: master's dissertation and Lacchè translation (2).
- In progress: Vrouwe Justitia, O contrato visual, Maria/Marianne, ICONOCRACIA (4).
- Presentations and seminars: existing seminar and eight other presentations (9).
- Exhibitions and digital projects: A Nação como Mulher (1).
- Shared resources: Ius Gentium and its digital library (2).

Record markup, status labels, author credits, original links and downloads are
retained. The four seminar destinations and witch presentation/slides remain.
Atlas is a directory link in the visual-project section, not a nineteenth record.
Historical detail-page content has not been recertified by this index merge.

Only `/publicacoes`, `/publicacoes/`, `/publicacoes/index.html` redirect to
`/trabalhos/#escrita`. There is no `/publicacoes/*` wildcard. Article detail URLs
and the open working-paper PDF remain. `/trabalhos/iconocracia` and descendants
remain delegated through the existing local service binding.

## Exhibition: local artifact versus production route

The local exhibition already has HTML, two hashed bundles and 18 plate files.
A read-only inspection on 2026-10-31 found proxied apex DNS and a classic Worker
route `anavanzin.com/*`; the live classic Worker delegates `/estudar` to origin
but otherwise uses its own ASSETS, without an exhibition exception. A public
hashed exhibition JS returned 404. This is not repaired by local source changes.

A future separately authorized production repair should preserve the existing
Worker and route only the exact exhibition root and descendants to the Pages
origin, following the existing origin-forwarding mechanism. Conceptual guard:

```js
const p = new URL(request.url).pathname;
const exhibition = p === '/atlas/nacao-como-mulher' ||
                   p.startsWith('/atlas/nacao-como-mulher/');
// In the verified live classic Worker only, delegate this path to the established
// Pages origin path in the same manner as /estudar, preserving query/method.
```

Do not replace the entire live Worker with this branch's different adapter.
Before deploying, snapshot the live script, verify origin fetch cannot recurse,
check the complete HTML/bundle/plate closure and content types, and regression-
test /estudar, state/KV, corpus URLs, the delegated work prefix and unrelated
404s. Rollback is the saved live Worker version. No DNS, route, Worker, Pages or
production changes were performed here; neither this note nor local tests prove
that the public 404 is fixed.
