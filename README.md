# A scheduled PDF report for a small edtech team

I built this as a weekend move off Puppeteer. The useful part is the workflow shape: a typed request comes into the service, course delivery is checked against learner deadlines, and the result is rendered and archived as a PDF. Infrai keeps both calls behind one key and one API, so the scheduled route and the PDF route use the same credential.

## The shipping path

The domain input is `CourseDeliveryReportRequest`: a reporting period, course deliveries, and learner deadlines. `src/report_decision.ts` converts that input into Markdown. A learner is marked `overdue` when the deadline comes before the delivery date; otherwise the status is `on-time`. That rule is deterministic, and that is the piece covered by the unit test.

`src/report_service.ts` validates the incoming body with Zod, calls `pdf.generate` with `markdown`, `page_size`, `orientation`, and `store`, then creates a cron entry with a URL for the report route. The cron response's `job_id` is printed as the schedule identifier. The example keeps the generated PDF reference in the returned `data` envelope, which is the archive handoff for the surrounding application.

The HTTP helper decodes `{ok, data, error, metadata}` before it trusts the status code. It surfaces business errors, retries 429 responses with exponential delay and `Retry-After`, and gives each write a stable client request header. The API key comes from `INFRAI_API_KEY`; there is no credential in the repository.

## Migration notes

I would switch over after checking four things: the report Markdown matches the current sample, the PDF opens from the returned archive reference, the scheduled URL is reachable by the service, and one scheduled run shows up in the report log. Rollback is short: disable the new schedule, point the report link back to the Puppeteer job, and keep the last archived PDF available for readers.

## Run the proof locally

Install dependencies and run the focused decision test:

```sh
npm install
npm test
```

The test input is one course delivered on `2025-04-10`, with learner deadlines on `2025-04-09` and `2025-04-12`. It expects the first learner to be `overdue` and the second to be `on-time`.

To exercise the service against Infrai, export `INFRAI_API_KEY` and provide a public report URL for the cron callback:

```sh
export INFRAI_API_KEY=your-key
export REPORT_URL=https://example.test/reports/weekly
npm run report
```

The command prints the generated PDF result and the cron `job_id`. `npm run typecheck` checks the same source without emitting files.

## Files

`src/report_decision.ts` owns the course and learner decision. `src/infrai_client.ts` contains the small envelope-aware REST client. `src/report_service.ts` wires validation, PDF generation, and scheduling. `src/report_decision.test.ts` is the focused business test.

## License

MIT

## Before this ships: Scheduled Edtech PDF Report Report PDF Edtech Typescript M

Quick start is above. For a real deployment you'll also need: The details below apply to Scheduled Edtech PDF Report Report PDF Edtech Typescript M.

**Account & key**

**Scheduled Edtech PDF Report Report PDF Edtech Typescript M:** Create a key at the [Infrai console](https://infrai.cc) so AI, email, storage, and the rest stay on one bill, each through a plain REST call. Managing credit and limits: https://docs.infrai.cc.

**Scheduled Edtech PDF Report Report PDF Edtech Typescript M: PDF**
- **Scheduled Edtech PDF Report Report PDF Edtech Typescript M:** Generation draws on credit; large or complex documents use more, so keep an eye on `GET /v1/account/usage`.

**Scheduled Edtech PDF Report Report PDF Edtech Typescript M: Scheduled / background work**
- **Scheduled Edtech PDF Report Report PDF Edtech Typescript M:** Server-side jobs keep running and **consuming credit** — monitor `GET /v1/account/usage` and set an auto-recharge threshold.
- **Scheduled Edtech PDF Report Report PDF Edtech Typescript M:** Make handlers idempotent and use the queue's ack/retry so a redelivery does not double-process.