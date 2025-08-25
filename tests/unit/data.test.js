// Unit tests for KRDS MCP Server data modules

import { describe, test, expect } from '@jest/globals';
import { KRDS_DATA } from '../../data/index.js';

describe('KRDS Data Modules', () => {
  describe('KRDS_DATA structure', () => {
    test('should have all required data categories', () => {
      expect(KRDS_DATA).toHaveProperty('designPrinciples');
      expect(KRDS_DATA).toHaveProperty('colors');
      expect(KRDS_DATA).toHaveProperty('typography');
      expect(KRDS_DATA).toHaveProperty('components');
      expect(KRDS_DATA).toHaveProperty('globalPatterns');
      expect(KRDS_DATA).toHaveProperty('servicePatterns');
      expect(KRDS_DATA).toHaveProperty('shapes');
      expect(KRDS_DATA).toHaveProperty('icons');
      expect(KRDS_DATA).toHaveProperty('spacingSystem');
    });

    test('should have design principles data', () => {
      expect(Array.isArray(KRDS_DATA.designPrinciples)).toBe(true);
      if (KRDS_DATA.designPrinciples.length > 0) {
        const principle = KRDS_DATA.designPrinciples[0];
        expect(principle).toHaveProperty('name');
        expect(principle).toHaveProperty('description');
      }
    });

    test('should have colors data', () => {
      expect(Array.isArray(KRDS_DATA.colors)).toBe(true);
      if (KRDS_DATA.colors.length > 0) {
        const color = KRDS_DATA.colors[0];
        expect(color).toHaveProperty('name');
        expect(color).toHaveProperty('id');
      }
    });

    test('should have typography data', () => {
      expect(Array.isArray(KRDS_DATA.typography)).toBe(true);
      if (KRDS_DATA.typography.length > 0) {
        const typography = KRDS_DATA.typography[0];
        expect(typography).toHaveProperty('name');
        expect(typography).toHaveProperty('id');
      }
    });

    test('should have components data', () => {
      expect(Array.isArray(KRDS_DATA.components)).toBe(true);
      if (KRDS_DATA.components.length > 0) {
        const component = KRDS_DATA.components[0];
        expect(component).toHaveProperty('name');
        expect(component).toHaveProperty('id');
      }
    });

    test('should have global patterns data', () => {
      expect(Array.isArray(KRDS_DATA.globalPatterns)).toBe(true);
      if (KRDS_DATA.globalPatterns.length > 0) {
        const pattern = KRDS_DATA.globalPatterns[0];
        expect(pattern).toHaveProperty('name');
        expect(pattern).toHaveProperty('id');
      }
    });

    test('should have service patterns data', () => {
      expect(Array.isArray(KRDS_DATA.servicePatterns)).toBe(true);
      if (KRDS_DATA.servicePatterns.length > 0) {
        const pattern = KRDS_DATA.servicePatterns[0];
        expect(pattern).toHaveProperty('name');
        expect(pattern).toHaveProperty('id');
      }
    });

    test('should have shapes data', () => {
      expect(typeof KRDS_DATA.shapes).toBe('object');
      expect(KRDS_DATA.shapes).not.toBeNull();
    });

    test('should have icons data', () => {
      expect(typeof KRDS_DATA.icons).toBe('object');
      expect(KRDS_DATA.icons).not.toBeNull();
    });

    test('should have spacing system data', () => {
      expect(typeof KRDS_DATA.spacingSystem).toBe('object');
      expect(KRDS_DATA.spacingSystem).not.toBeNull();
    });
  });

  describe('Data validation', () => {
    test('design principles should have valid structure', () => {
      KRDS_DATA.designPrinciples.forEach((principle, _index) => {
        expect(principle).toHaveProperty('name');
        expect(principle).toHaveProperty('description');
        expect(typeof principle.name).toBe('string');
        expect(typeof principle.description).toBe('string');
        expect(principle.name.length).toBeGreaterThan(0);
        expect(principle.description.length).toBeGreaterThan(0);
      });
    });

    test('colors should have valid structure', () => {
      KRDS_DATA.colors.forEach((color, _index) => {
        expect(color).toHaveProperty('name');
        expect(color).toHaveProperty('id');
        expect(typeof color.name).toBe('string');
        expect(typeof color.id).toBe('string');
        expect(color.name.length).toBeGreaterThan(0);
        expect(color.id.length).toBeGreaterThan(0);
      });
    });

    test('components should have valid structure', () => {
      KRDS_DATA.components.forEach((component, _index) => {
        expect(component).toHaveProperty('name');
        expect(component).toHaveProperty('id');
        expect(typeof component.name).toBe('string');
        expect(typeof component.id).toBe('string');
        expect(component.name.length).toBeGreaterThan(0);
        expect(component.id.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Data accessibility', () => {
    test('should be able to access all data categories without errors', () => {
      expect(() => KRDS_DATA.designPrinciples).not.toThrow();
      expect(() => KRDS_DATA.colors).not.toThrow();
      expect(() => KRDS_DATA.typography).not.toThrow();
      expect(() => KRDS_DATA.components).not.toThrow();
      expect(() => KRDS_DATA.globalPatterns).not.toThrow();
      expect(() => KRDS_DATA.servicePatterns).not.toThrow();
      expect(() => KRDS_DATA.shapes).not.toThrow();
      expect(() => KRDS_DATA.icons).not.toThrow();
      expect(() => KRDS_DATA.spacingSystem).not.toThrow();
    });

    test('should have consistent data types', () => {
      expect(Array.isArray(KRDS_DATA.designPrinciples)).toBe(true);
      expect(Array.isArray(KRDS_DATA.colors)).toBe(true);
      expect(Array.isArray(KRDS_DATA.typography)).toBe(true);
      expect(Array.isArray(KRDS_DATA.components)).toBe(true);
      expect(Array.isArray(KRDS_DATA.globalPatterns)).toBe(true);
      expect(Array.isArray(KRDS_DATA.servicePatterns)).toBe(true);
      expect(typeof KRDS_DATA.shapes).toBe('object');
      expect(typeof KRDS_DATA.icons).toBe('object');
      expect(typeof KRDS_DATA.spacingSystem).toBe('object');
    });
  });
});
