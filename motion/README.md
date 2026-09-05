# BGI field film

12-second silent 1920 × 1080, 24 fps Remotion composition for the About page.
It uses the existing BGI photographs with gentle framing changes, restrained color
grading, three smooth scene dissolves, and a small gold survey-line accent. No text,
logos, audio, or generated equipment movement is present.

All movement is calculated from `useCurrentFrame()`. Camera transforms, opacity,
and signal details repeat every 288 frames, including across the video loop seam.

## Render

Use Node.js and install the exact package versions in `package.json` with `npm install`.
Then run `npm run render`. Output is `renders/bgi-field-film.mp4`; the midpoint poster
is `renders/field-film-frame-144.png`. `npm run still` renders only inspection stills.
If Chromium is already installed, set `REMOTION_BROWSER_EXECUTABLE` to its executable
before rendering. Otherwise Remotion can provision its compatible browser.

The included lightweight opening poster was extracted from the finished MP4 with:

```sh
ffmpeg -i renders/bgi-field-film.mp4 -frames:v 1 -q:v 3 renders/bgi-field-film-poster.jpg
```

The current build used an existing read-only dependency installation linked as
`node_modules`. That link is local infrastructure; do not commit or copy it.

## Integration

Copy `src/`, `render.mjs`, `package.json`, `README.md`,  into the `motion/` source folder in the website repository to retain the editable
composition. Source photographs are read directly from the repository’s `images/` folder. Copy the rendered MP4 into the website's public media folder. The
website only needs the MP4 and its poster at runtime; it does not need Remotion.

Use a muted looping inline video with a static poster and pause control. Respect
`prefers-reduced-motion` by showing the poster until the visitor chooses to play.
No wording needs to change because the film contains no text.

The render uses H.264, yuv420p, BT.709, no audio track, and a 2.8 Mbps video target
to balance broad browser compatibility with compact website delivery.

Official references: https://www.remotion.dev/docs/renderer/render-media and
https://www.remotion.dev/docs/animating-properties.
