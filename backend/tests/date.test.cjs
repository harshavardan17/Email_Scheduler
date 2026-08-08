const assert = require("node:assert/strict");
const test = require("node:test");

const { parseScheduledDateValue } = require("../src/utils/date");

test("parses local datetime strings as Asia/Kolkata wall time", () => {
  const result = parseScheduledDateValue("2026-08-08T20:30");

  assert.ok(result instanceof Date);
  assert.equal(result.toISOString(), "2026-08-08T15:00:00.000Z");
});
