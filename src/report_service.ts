import { z } from "zod";
import { buildReport } from "./report_decision.ts";
import { infraiRequest } from "./infrai_client.ts";

const requestSchema = z.object({
  period: z.string().min(1),
  deliveries: z.array(z.object({ course: z.string(), deliveredOn: z.string() })),
  deadlines: z.array(z.object({ learner: z.string(), course: z.string(), dueOn: z.string() }))
});

const example = {
  period: "2025-W15",
  deliveries: [{ course: "Algebra 1", deliveredOn: "2025-04-10" }],
  deadlines: [{ learner: "Mina", course: "Algebra 1", dueOn: "2025-04-09" }, { learner: "Jon", course: "Algebra 1", dueOn: "2025-04-12" }]
};
requestSchema.parse(example);
const markdown = buildReport(example);
const capabilityName = "pdf.generate";
const pdf = await infraiRequest<{ id?: string; url?: string }>("/v1/pdf/generate", "POST", { markdown, page_size: "A4", orientation: "portrait", store: true });
const schedule = await infraiRequest<{ job_id: string }>("/v1/cron/create", "POST", { cron_expr: "0 8 * * 1", task: process.env.REPORT_URL ?? "http://localhost:3000/reports/weekly" });
console.log(JSON.stringify({ pdf, job_id: schedule.job_id }));
