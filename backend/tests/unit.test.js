const { calculateProgress } = require('../controllers/goal.controller');

describe('calculateProgress Unit Tests', () => {
    it('should return 100% when achievement reaches target for Numeric UoM', () => {
        expect(calculateProgress('Numeric', 100, 100)).toBe(100);
    });

    it('should return correct percentage for Numeric UoM', () => {
        expect(calculateProgress('Numeric', 100, 50)).toBe(50);
    });

    it('should cap progress at 100% even if achievement exceeds target', () => {
        expect(calculateProgress('Numeric', 100, 150)).toBe(100);
    });

    it('should return 0 when target is 0 or undefined', () => {
        expect(calculateProgress('Numeric', 0, 50)).toBe(0);
        expect(calculateProgress('Numeric', null, 50)).toBe(0);
    });

    it('should handle Zero-based targets (100% if achievement is 0)', () => {
        expect(calculateProgress('Zero-based', 5, 0)).toBe(100);
        expect(calculateProgress('Zero-based', 5, 1)).toBe(0);
    });

    it('should handle Timeline targets (100% if achievement <= target)', () => {
        expect(calculateProgress('Timeline', 50, 40)).toBe(100);
        expect(calculateProgress('Timeline', 50, 60)).toBe(0);
    });
});
