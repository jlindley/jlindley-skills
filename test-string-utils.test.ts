import { describe, it } from 'node:test';
import assert from 'node:assert';
import { reverseString } from './test-string-utils';

describe('reverseString', () => {
  it('should reverse a normal string', () => {
    const result = reverseString('hello');
    assert.strictEqual(result, 'olleh');
  });

  it('should handle empty string', () => {
    const result = reverseString('');
    assert.strictEqual(result, '');
  });

  it('should handle single character', () => {
    const result = reverseString('a');
    assert.strictEqual(result, 'a');
  });
});
