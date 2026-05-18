import { describe, expect, it } from 'vitest';
import { getSurface } from './surface';

describe('surface helper', () => {
  it('returns desktop when desktop mode is true', () => {
    expect(getSurface(true)).toBe('desktop');
  });

  it('returns mobile when desktop mode is false', () => {
    expect(getSurface(false)).toBe('mobile');
  });
});
