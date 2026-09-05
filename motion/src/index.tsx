import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {FieldFilm, FILM_FRAMES} from './FieldFilm';

registerRoot(() => <Composition id="BGIFieldFilm" component={FieldFilm}
  durationInFrames={FILM_FRAMES} fps={24} width={1920} height={1080}/>);
