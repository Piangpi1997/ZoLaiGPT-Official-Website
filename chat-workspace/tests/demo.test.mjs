import test from 'node:test';
import assert from 'node:assert/strict';
import { makeReply, safeAttachment, transcript } from '../lib/demo.mjs';
import { translations } from '../lib/source-translations.mjs';

test('each language uses the preserved source rather than invented product claims', () => {
  for (const lang of ['en','my','zom']) {
    assert.ok(makeReply('languages',lang).includes(translations[lang].f1d));
    assert.ok(makeReply('mission',lang).includes(translations[lang].aboutbody));
    assert.ok(makeReply('app release',lang).includes(translations[lang].appdesc));
  }
});
test('unknown questions and code samples disclose the simulation', () => {
  assert.match(makeReply('What is the weather?'), /prewritten replies/);
  assert.match(makeReply('JavaScript example'), /prewritten interface sample/);
});
test('local attachments are bounded and executable file types are rejected', () => {
  assert.equal(safeAttachment('notes.md',102400),true);
  assert.equal(safeAttachment('notes.txt',102401),false);
  assert.equal(safeAttachment('script.html',500),false);
  assert.equal(safeAttachment('photo.png',500),false);
});
test('exports include both sides and an explicit demo label', () => {
  const output=transcript({title:'Languages',messages:[{role:'user',content:'hello'},{role:'assistant',content:'English'}]});
  assert.match(output,/no live AI/); assert.match(output,/## You/); assert.match(output,/hello/); assert.match(output,/English/);
});
