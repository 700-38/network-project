function hashStringToSeed(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return hash < 0 ? -hash : hash; // Ensure the hash is always positive
}

// Seeded pseudo-random number generator using a linear congruential generator
class SeededRNG {
  seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  // Linear Congruential Generator
  next() {
    const a = 1664525;
    const c = 1013904223;
    const m = Math.pow(2, 32);
    this.seed = (a * this.seed + c) % m;
    return this.seed / m;
  }
}

// Function to generate a random hex color based on a string seed
export function seededHexColor(strSeed: string) {
  const numericalSeed = hashStringToSeed(strSeed);
  const rng = new SeededRNG(numericalSeed);
  const color = Math.floor(rng.next() * 16777215).toString(16);
  return color.padStart(6, '0');
}
