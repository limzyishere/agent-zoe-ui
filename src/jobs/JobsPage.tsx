import { useState } from "react";
import { Tabs, Tab, Box } from "@mui/material";
import { useJobs } from "../hooks/useJobs";
import { useDeleteJob } from "../hooks/useJobs";
import JobTable from "./JobTable";
import type { JobStatus } from "../api/jobs";

const STATUSES: JobStatus[] = [
  "PENDING",
  "COMPLETE",
  "FAIL",
];

export default function JobsPage() {
  const [status, setStatus] =
    useState<JobStatus>("PENDING");

  const { data = [], isLoading } = useJobs(status);
  const deleteJob = useDeleteJob(status);

  return (
    <Box>
      <Tabs
        value={status}
        onChange={(_, v) => setStatus(v)}
        sx={{ mb: 2 }}
      >
        {STATUSES.map((s) => (
          <Tab key={s} label={s} value={s} />
        ))}
      </Tabs>

      <JobTable
        jobs={data}
        status={status}
        loading={isLoading}
        onDelete={(id) =>
          deleteJob.mutate(id)
        }
      />
    </Box>
  );
}
