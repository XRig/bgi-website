import {bundle} from '@remotion/bundler';
import {openBrowser, selectComposition, renderMedia, renderStill} from '@remotion/renderer';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {mkdir} from 'node:fs/promises';

const root = path.dirname(fileURLToPath(import.meta.url));
const output = path.join(root, 'renders');
await mkdir(output, {recursive: true});
const serveUrl = await bundle({entryPoint: path.join(root, 'src/index.tsx'),
  outDir: path.join(root, 'build'), publicDir: path.join(root, '..', 'images'),
  enableCaching: false, webpackOverride: config => ({...config, cache: false}),
});
const browserExecutable = process.env.REMOTION_BROWSER_EXECUTABLE;
const browser = await openBrowser('chrome', {browserExecutable, logLevel: 'warn'});
try {
  const composition = await selectComposition({serveUrl, id: 'BGIFieldFilm', puppeteerInstance: browser});
  for (const frame of [0, 144, 287]) {
    await renderStill({composition, serveUrl, puppeteerInstance: browser, frame,
      imageFormat: 'png', output: path.join(output, `field-film-frame-${frame}.png`),
    });
  }
  if (!process.argv.includes('--still-only')) {
    let lastBucket = -1;
    await renderMedia({composition, serveUrl, puppeteerInstance: browser,
      codec: 'h264', outputLocation: path.join(output, 'bgi-field-film.mp4'),
      videoBitrate: '2800k', maxRate: '3500k', bufferSize: '7000k',
      pixelFormat: 'yuv420p', colorSpace: 'bt709', imageFormat: 'png',
      muted: true, concurrency: 2, x264Preset: 'slow',
      onProgress: ({progress}) => {
        const bucket = Math.floor(progress * 10);
        if (bucket !== lastBucket) {console.log(`Rendering ${bucket * 10}%`); lastBucket = bucket;}
      },
    });
  }
} finally {
  await browser.close({silent: true});
}
