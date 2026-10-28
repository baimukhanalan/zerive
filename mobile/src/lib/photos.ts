// Editorial scene photography. A daily-rotating hero (by day of month) mirrors
// the design; individual scenes back the welcome, home header and bio-age card.

const vial = require('../../assets/photos/scene-vial.jpg');
const eye = require('../../assets/photos/scene-eye.jpg');
const lab = require('../../assets/photos/scene-lab.jpg');
const nature = require('../../assets/photos/scene-nature.jpg');
const runner = require('../../assets/photos/scene-runner.jpg');
const supp = require('../../assets/photos/scene-supp.jpg');

export const PHOTOS = { vial, eye, lab, nature, runner, supp };

const HERO_POOL = [eye, nature, runner, lab, supp, vial];

/** Deterministic daily hero — same shot all day, rotates across the month. */
export function heroPhoto(shift = 0) {
  const day = new Date().getDate() - 1;
  return HERO_POOL[(day + shift + HERO_POOL.length) % HERO_POOL.length];
}
