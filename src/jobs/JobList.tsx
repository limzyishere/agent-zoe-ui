import {
  Box,
  Paper,
  Typography,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useJobs } from "../hooks/useJobs";

function statusColor(status: string) {
  switch (status) {
    case "PENDING":
      return "warning";
    case "COMPLETED":
      return "success";
    case "FAILED":
      return "error";
    default:
      return "default";
  }
}

export default function JobList() {
  const { data: jobs = [], isLoading } = useJobs();

  if (isLoading) {
    return <Typography>Loading jobs…</Typography>;
  }

  if (jobs.length === 0) {
    return (
      <Typography color="text.secondary">
        No jobs found
      </Typography>
    );
  }

  return (
    <Stack spacing={2}>
      {jobs.map((job) => (
        <Accordion key={job.id}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              sx={{ width: "100%" }}
            >
              <Typography sx={{ flexGrow: 1 }}>
                Job #{job.id}
              </Typography>

              <Chip
                size="small"
                label={job.status}
                color={statusColor(job.status)}
              />

              <Typography variant="caption">
                {new Date(job.created_at).toLocaleString()}
              </Typography>
            </Stack>
          </AccordionSummary>

          <AccordionDetails>
            <Stack spacing={2}>
              <Paper
                variant="outlined"
                sx={{ p: 2, whiteSpace: "pre-wrap" }}
              >
                {job.message}
              </Paper>

              <Box>
                <Typography variant="subtitle2">
                  Recipients ({job.contacts.length})
                </Typography>

                {job.contacts.map((c) => (
                  <Typography key={c.id} variant="body2">
                    {c.name} — {c.phone}
                  </Typography>
                ))}
              </Box>
            </Stack>
          </AccordionDetails>
        </Accordion>
      ))}
    </Stack>
  );
}
