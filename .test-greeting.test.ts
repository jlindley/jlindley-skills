import { describe, it } from 'node:test';
import assert from 'node:assert';
import { greet } from './.test-greeting';

describe('greet', () => {
  it('should greet a valid name', () => {
    const result = greet('Alice');
    assert.strictEqual(result, 'Hello, Alice!');
  });

  it('should throw on empty string', () => {
    assert.throws(
      () => greet(''),
      { message: 'Name cannot be empty' }
    );
  });

  it('should throw on whitespace-only string', () => {
    assert.throws(
      () => greet('   '),
      { message: 'Name cannot be empty' }
    );
  });
});
