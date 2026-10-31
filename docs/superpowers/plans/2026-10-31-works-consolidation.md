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

## Additional user-selected resources

The index now has 20 distinct records/resources: two additional digital prototypes
are listed separately, without collapsing them into the personal Atlas directory
or the nine-object exhibition.

- “Alegorias do Estado”, `/iconocracia/atlas/`: research companion prototype.
  Active AtlasData supplies demonstration counts, percentages and scores; loading
  corpus.generated.js does not override it. Visible prototype notice and statistic
  labels disclose this; no data connection or metric recalculation was attempted.
- “Radiografia — comparação iconométrica”, `/iconocracia/radiografia/`: separate
  interactive comparison prototype. Illustrative scores and score-derived prose
  are explicitly labelled; overlays are not pixel registration. Existing noindex
  remains. Connecting real corpus evidence is a separate research task.

## Latest homepage editorial direction

Questions now open substantive native disclosures with specific work links;
unfinished blind-Justice essay and duplicate beginner-methodology question are
not featured. Exhibition and glossary have distinct presentations. Illustrated
index is third, after hero/introduction; defense and methodology share a responsive
pair. The STF image has visible observation/question and expandable commentary,
not an invented explanation of the artist’s intention. Narrenschiff is credited
as Ana’s colour intervention based on the French version, per author clarification;
edition, copy, date and scan provenance remain unverified research metadata.

Ampulheta app/page and exclusive code/icon were removed with active launch paths,
manifest and expectations. Unrelated introductory hourglass animation, loader and
literary quotations remain. Prior versions are recoverable from Git history.

The defense’s existing YouTube ID abbUWwb3-As was not replaced: public metadata
reports playable/embed-enabled1:31:07 but the correct recording identity remains
under user clarification. No unrelated video is substituted.

Ius Gentium and Biblioteca now lead the index under “Pesquisa coletiva e
construção de acervos”. The official group site identifies Direito Internacional
at UFSC; the earlier iconography-only description and unverified fortnightly
schedule were removed. Ana's library-building contribution is stated in first
person per her explicit account, without claiming founding or sole authorship.
Source checked: https://grupoiusgentium.com.br/ on 2026-10-31.
