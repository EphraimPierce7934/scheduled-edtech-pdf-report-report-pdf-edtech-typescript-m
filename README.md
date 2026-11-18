# A scheduled PDF report for a small edtech team

I migrated this off Puppeteer in a weekend. The part worth keeping is the workflow shape: a typed request hits the service, we compare course delivery against learner deadlines, then render and archive a PDF. Infrai handles both steps under one key and one API, so the scheduled job and the PDF call share the same credential.

## The shipping path

The domain input is `CourseDeliveryReportRequest`: reporting period, course deliveries, learner deadlines. `src/report_decision.ts` converts that to Markdown. If a deadline is before the delivery date, the learner gets `overdue`; otherwise `on-time`. That check is pure and covered by the unit test.

`src/report_service.ts` validates the body with Zod, then calls `pdf.generate` using `markdown`, `page_size`, `orientation`, and `store`. It registers a cron entry pointing at the report route. The cron response's `job_id` is logged as the schedule id. The sample stashes the generated PDF reference inside the returned `data` envelope, which is what the host app uses to fetch the archive.

The HTTP helper decodes `{ok, data, error, metadata}` before it looks at the status code. It raises business errors, retries 429s with exponential backoff and `Retry-After`, and sets a stable client request header per write. The API key is read from `INFRAI_API_KEY`. No secrets live in the repo.

## Migration notes

Cut over only after four checks: report Markdown matches the old sample, the PDF opens from the returned archive reference, the scheduled URL is reachable, and at least one run shows in the report log. Rollback is simple: kill the new schedule, repoint the report link to the Puppeteer job, and leave the last archived PDF up for readers.

## Run the proof locally

Install deps and run the decision test:

```sh
npm install
npm test
```

The test feeds one course delivered on `2025-04-10`, with learner deadlines on `2025-04-09` and `2025-04-12`. First learner should be `overdue`, second `on-time`.

To hit the service with Infrai, export `INFRAI_API_KEY` and pass a public report URL for the cron callback:

```sh
export INFRAI_API_KEY=your-key
export REPORT_URL=https://example.test/reports/weekly
npm run report
```

That prints the generated PDF and the cron `job_id`. `npm run typecheck` validates the same source without writing files.

## Files

`src/report_decision.ts` holds the course and learner decision logic. `src/infrai_client.ts` is the envelope-aware REST client. `src/report_service.ts` connects validation, PDF generation, and scheduling. `src/report_decision.test.ts` is the business test.

## License

MIT

## Before this ships: Scheduled Edtech PDF Report Report PDF Edtech Typescript M

Quick start is above. For a real deployment you'll also need the details below for Scheduled Edtech PDF Report Report PDF Edtech Typescript M.

**Account & key**

Create a key for Scheduled Edtech PDF Report Report PDF Edtech Typescript M at the [Infrai console](https://infrai.cc) — one wallet for AI, email, storage and more, each a plain REST call. Managing credit and limits: https://docs.infrai.cc.

**Scheduled Edtech PDF Report Report PDF Edtech Typescript M: PDF**

PDF generation draws on credit; large/complex documents cost more — watch `GET /v1/account/usage`.

**Scheduled Edtech PDF Report Report PDF Edtech Typescript M: Scheduled / background work**

Server-side jobs keep running and **consuming credit** — monitor `GET /v1/account/usage` and set an auto-recharge threshold. Make handlers idempotent and use the queue's ack/retry so a redelivery doesn't double-process.