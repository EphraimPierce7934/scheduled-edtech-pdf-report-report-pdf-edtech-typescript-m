export type Delivery = { course: string; deliveredOn: string };
export type LearnerDeadline = { learner: string; course: string; dueOn: string };
export type CourseDeliveryReportRequest = {
  period: string;
  deliveries: Delivery[];
  deadlines: LearnerDeadline[];
};

export function buildReport(input: CourseDeliveryReportRequest): string {
  const deliveryDates = new Map(input.deliveries.map((item) => [item.course, item.deliveredOn]));
  const rows = input.deadlines.map((deadline) => {
    const deliveredOn = deliveryDates.get(deadline.course);
    const status = deliveredOn && deadline.dueOn < deliveredOn ? "overdue" : "on-time";
    return `| ${deadline.learner} | ${deadline.course} | ${deadline.dueOn} | ${deliveredOn ?? "pending"} | ${status} |`;
  });
  return [
    `# Course delivery report: ${input.period}`,
    "",
    "| Learner | Course | Deadline | Delivered | Status |",
    "| --- | --- | --- | --- | --- |",
    ...rows,
    ""
  ].join("\n");
}
