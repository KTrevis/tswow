import { describe, expect, it } from 'vitest';
import { matchesSpellName, normalizeSpellSearch } from './spell-search';

describe('spell search', () => {
  it('normalizes case, accents and surrounding spaces', () => {
    expect(normalizeSpellSearch('  ÉPOUVANTE  ')).toBe('epouvante');
  });

  it('matches spell names by normalized substring', () => {
    expect(matchesSpellName('Grande Épouvante', 'epouvante')).toBe(true);
    expect(matchesSpellName('Trait de l’ombre', 'OMBRE')).toBe(true);
    expect(matchesSpellName('Trait de l’ombre', 'feu')).toBe(false);
  });

  it('does not match an empty search', () => {
    expect(matchesSpellName('Épouvante', '   ')).toBe(false);
  });
});
