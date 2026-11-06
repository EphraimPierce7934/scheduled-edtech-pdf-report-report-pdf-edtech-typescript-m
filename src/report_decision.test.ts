import assert from "node:assert/strict";
import { buildReport } from "./report_decision.ts";

const report = buildReport({
  period: "2025-W15",
  deliveries: [{ course: "Algebra 1", deliveredOn: "2025-04-10" }],
  deadlines: [{ learner: "Mina", course: "Algebra 1", dueOn: "2025-04-09" }, { learner: "Jon", course: "Algebra 1", dueOn: "2025-04-12" }]
});
assert.match(report, /Mina.*overdue/);
assert.match(report, /Jon.*on-time/);
console.log("report decision test passed");
