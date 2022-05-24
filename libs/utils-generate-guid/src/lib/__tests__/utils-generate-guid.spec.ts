import { generateGuid } from '../utils-generate-guid';

describe('generate guid', () => {
  it('generates a random id of length 36', () => {
    expect(generateGuid()).toHaveLength(36);
  });
  it('generates a string', () => {
    expect(typeof generateGuid()).toBe('string');
  });
});
