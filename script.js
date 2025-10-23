// Taken from the course of Josh
// https://whimsy.joshwcomeau.com

const btn = document.querySelector('.particleButton');

const FADE_DURATION = 1000;

btn.addEventListener('click', () => {
  btn.classList.toggle('liked');

  const isLiked = btn.classList.contains('liked');
  if (!isLiked) {
    return;
  }

  const particles = [];
  range(5).forEach(() => {
    const particle = document.createElement('span');
    particle.classList.add('particle');

    const angle = random(0, 360);
    const distance = random(32, 40);

    // NOTE: Be sure to specify the angle as degrees, not pixels:
    particle.style.setProperty('--angle', angle + 'deg');
    particle.style.setProperty('--distance', distance + 'px');

    particle.style.setProperty('--fade-duration', FADE_DURATION + 'ms');

    btn.appendChild(particle);
    particles.push(particle);
  });
  
  window.setTimeout(() => {
    particles.forEach((particle) => {
      particle.remove();
    });
  }, FADE_DURATION + 200);
});

/**
 * Produces a random number between the inclusive lower and upper bounds.
 * If only one argument is provided, a number between 0 and that number is returned.
 * If `floating` is true, or either bound is a float, a floating-point number is returned.
 *
 * @param {number} [lower=0] - The lower bound.
 * @param {number} [upper=1] - The upper bound.
 * @param {boolean} [floating] - Specify returning a floating-point number.
 * @returns {number} Returns the random number.
 */
function random(lower = 0, upper = 1, floating) {
  // If only one argument is passed, shift params
  if (upper === undefined) {
    upper = lower;
    lower = 0;
  }

  // Determine if result should be floating
  if (
    floating === true ||
    !Number.isInteger(lower) ||
    !Number.isInteger(upper)
  ) {
    return Math.random() * (upper - lower) + lower;
  }

  // Inclusive integer
  return Math.floor(Math.random() * (upper - lower + 1)) + lower;
}

/**
 * Creates an array of numbers progressing from `start` up to, but not including, `end`.
 * 
 * If `end` is not specified, it's set to `start` with `start` then set to 0.
 * A `step` of -1 is used if `start` is greater than `end`.
 *
 * @param {number} [start=0] - The start of the range.
 * @param {number} [end] - The end of the range (not included).
 * @param {number} [step=1] - The value to increment or decrement by.
 * @returns {number[]} Returns the range of numbers.
 */
function range(start = 0, end, step) {
  // Handle case where only one argument is provided
  if (end === undefined) {
    end = start;
    start = 0;
  }

  // Default step depending on direction
  if (step === undefined) {
    step = start < end ? 1 : -1;
  }

  const result = [];
  const ascending = step > 0;

  if (ascending) {
    for (let i = start; i < end; i += step) {
      result.push(i);
    }
  } else {
    for (let i = start; i > end; i += step) {
      result.push(i);
    }
  }

  return result;
}
