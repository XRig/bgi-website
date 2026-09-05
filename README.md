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

The build updates content-based version queries on CSS imports and each page's stylesheet, script, logo, and favicon links. This makes returning visitors load changed assets immediately instead of retaining a previous design from their browser cache. Include the resulting HTML and `css/style.css` changes in the same commit as an asset update; the checked-in source remains ready for direct static hosting.

## Adding the first journal entry

There is no CMS, account, or publishing service to configure. When an article is ready, create a new static HTML page using the shared header/footer, give it its own title, description, canonical URL and article content, then replace the coming-soon area in `blog.html` with a link and excerpt. Add the article URL to `sitemap.xml` and update the homepage's journal introduction. Keep publication dates factual. No article is published by this redesign.

## Motion and accessibility

`js/main.js` handles mobile navigation, visible-section entrances, decorative signal graphics, depth between original photo planes, and the footer motion control. The About-page field film is a 12-second Remotion composition built from three existing field photographs. Its editable source lives in `motion/`; rendered video and poster live in `media/`. Remotion is only a production tool and is not loaded in visitors’ browsers. Signal lines are an abstract illustration, not seismic readings or current production data. Animations stop when the page is hidden or the graphic is out of view. The user's reduced-motion setting takes priority; the optional pause preference is stored only on their device. Core content, contact links, and navigation remain usable without JavaScript.

The original website wording has been restored at the owner’s request, including the homepage headline, approach, project descriptions, interior-page headings, and all existing body content. Only the new blog and accessibility controls introduce new copy. The visual work does not refresh operating statistics or resolve existing inconsistencies in the source copy.

## Logo

The supplied low-resolution BGI mark was vectorized using deterministic tracing. The black and white SVG variants in `images/` have transparent backgrounds and omit the lettering from the original image. The mark is used in navigation, the footer, and the favicon.
