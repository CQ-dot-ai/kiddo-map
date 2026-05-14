import { describe, expect, it } from 'vitest';
import {
  getBackupContrastReason,
  getMapPlaces,
  getPicks,
  getRankedPlaces,
  getTodayContext,
  todayReasons,
} from './recommendation';

function makePlace(overrides = {}) {
  return {
    id: 'test-place',
    name: 'Test Place',
    nameEn: 'Test Place',
    emoji: '🧪',
    area: 'KLCC',
    address: 'Test Address, Kuala Lumpur',
    color: { primary: '#FF8A65', light: '#FFF3E0', dark: '#E65100' },
    ourRating: 4.5,
    indoor: true,
    weatherSafe: true,
    ageMin: 2,
    ageMax: 12,
    durationHours: '2-3',
    cost: 20,
    facilities: { stroller: 4, diaper: 4, food: 4, restroom: 4, aircon: 4 },
    ...overrides,
  };
}

describe('recommendation helpers', () => {
  it('derives weekend context from a date', () => {
    const friday = getTodayContext(new Date('2026-05-15T09:00:00+08:00'));
    const saturday = getTodayContext(new Date('2026-05-16T09:00:00+08:00'));

    expect(friday.isWeekend).toBe(false);
    expect(saturday.isWeekend).toBe(true);
    expect(saturday.isMorning).toBe(true);
    expect(saturday.hour).toBe(9);
  });

  it('ranks the better matching place higher', () => {
    const main = makePlace({
      id: 'main',
      ourRating: 4.1,
      indoor: false,
      weatherSafe: false,
      ageMin: 8,
      ageMax: 14,
      durationHours: '4-5',
      cost: 80,
      facilities: { stroller: 2, diaper: 2, food: 2, restroom: 2, aircon: 0 },
    });
    const backup = makePlace({
      id: 'backup',
      ourRating: 4.4,
      indoor: true,
      weatherSafe: true,
      ageMin: 2,
      ageMax: 10,
      durationHours: '1-2',
      cost: 0,
      facilities: { stroller: 5, diaper: 5, food: 5, restroom: 5, aircon: 5 },
    });

    const ranked = getRankedPlaces([main, backup], {
      age: 'any',
      area: 'any',
      time: 'any',
      energy: 'any',
    }, [], { isMorning: false, isAfternoon: true, isWeekend: true });

    expect(ranked[0].id).toBe('backup');
    expect(ranked[1].id).toBe('main');
  });

  it('rotates picks without changing pick count', () => {
    const picks = getPicks([{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }], 2, 3);

    expect(picks).toEqual([{ id: 3 }, { id: 4 }, { id: 1 }]);
  });

  it('maps all places when full map is requested', () => {
    const all = [{ id: 1 }, { id: 2 }];
    const current = [{ id: 3 }];

    expect(getMapPlaces(true, all, [], current)).toEqual(all);
    expect(getMapPlaces(false, all, [], current)).toEqual(current);
  });

  it('describes the better contrast reason for a cheaper backup', () => {
    const main = makePlace({ id: 'main', cost: 80, indoor: true });
    const backup = makePlace({ id: 'backup', cost: 0, indoor: true });

    expect(getBackupContrastReason(main, backup)).toMatchObject({
      icon: '🆓',
      text: 'Free entry',
    });
  });

  it('returns five today reasons in the expected order', () => {
    const place = makePlace({ durationHours: '3-4' });
    const reasons = todayReasons(place, 'any', {
      isMorning: true,
      isAfternoon: false,
      isWeekend: false,
    });

    expect(reasons).toHaveLength(5);
    expect(reasons[0][1]).toBe('Why today');
    expect(reasons[4][1]).toBe('Drive');
  });
});
