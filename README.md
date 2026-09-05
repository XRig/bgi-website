# Berkeley Geoimaging website

The bgina.com website uses static HTML, CSS, and JavaScript. It has no runtime dependencies or installation step. All existing public page addresses are preserved.

## Preview and publish

Run a local static web server from this directory, such as `python3 -m http.server 4173`, then open the printed local address. Do not serve the repository itself publicly: `.git`, scripts, and local configuration are development files.

`node scripts/build.mjs` copies only the public pages, styles, scripts, images, sitemap, and robots file into `dist/`. Deploy `dist/` to a static host. The build output is ignored by Git. The existing host can also continue serving the original public HTML/assets directly.

The `.openai/hosting.json` file identifies a separate private Sites review copy. Publishing that review copy does not change bgina.com or its DNS. The GitHub main branch remains the source for the existing website until the redesign pull request is reviewed and merged.

## Pages and content

- `index.html`: homepage, operating footprint, company introduction, operations, journal introduction.
- `about.html`: company history and team.
- `bgi-resources.html`: operated Oklahoma portfolio, concession details, prospects.
- `forbes-lake.html`: non-operated Illinois interest and historical production.
- `blog.html`: the BGI Journal. It intentionally contains no posts, sample articles, or signup form.
- `contact.html`: office and management contacts.
- `404.html`: missing-page fallback for hosts configured to serve it.

Shared navigation and footer are present in each page so navigation works without JavaScript. Update every HTML page when changing those shared areas. `css/variables.css` contains the brand tokens. `css/revamp.css` contains the redesign and responsive layouts; the original CSS structure remains intact.

## Adding the first journal entry

There is no CMS, account, or publishing service to configure. When an article is ready, create a new static HTML page using the shared header/footer, give it its own title, description, canonical URL and article content, then replace the coming-soon area in `blog.html` with a link and excerpt. Add the article URL to `sitemap.xml` and update the homepage's journal introduction. Keep publication dates factual. No article is published by this redesign.

## Motion and accessibility

`js/main.js` handles mobile navigation, visible-section entrances, decorative signal graphics, and the footer motion control. Signal lines are an abstract illustration, not seismic readings or current production data. Animations stop when the page is hidden or the graphic is out of view. The user's reduced-motion setting takes priority; the optional pause preference is stored only on their device. Core content, contact links, and navigation remain usable without JavaScript.

The visual work does not refresh operating statistics. Existing field figures and their historical context were retained. The inconsistent Warren 1 barrel total on the About page was replaced with a non-numeric description; the detailed Forbes Lake figures are unchanged and should be reviewed by the business when updated production information is available.
