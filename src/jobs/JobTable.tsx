import {
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Typography,
  IconButton,
  Collapse,
  Stack,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState } from "react";
import type { Job } from "../api/jobs";

type Props = {
  jobs: Job[];
  status: "PENDING" | "COMPLETE" | "FAIL";
  loading?: boolean;
  onDelete: (id: number) => void;
};

export default function JobTable({
  jobs,
  status,
  loading,
  onDelete,
}: Props) {
  const [openId, setOpenId] = useState<number | null>(null);

  function toggle(id: number) {
    setOpenId(openId === id ? null : id);
  }

  function handleDelete(id: number) {
    const ok = window.confirm(
      "Delete this pending job?\nThis cannot be undone."
    );
    if (!ok) return;

    onDelete(id);
  }

  if (loading) {
    return <Typography>Loading…</Typography>;
  }

  if (jobs.length === 0) {
    return (
      <Typography color="text.secondary">
        No jobs found
      </Typography>
    );
  }

  return (
    <Paper>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>ID</TableCell>
            <TableCell>Created</TableCell>
            <TableCell>Recipients</TableCell>
            {status === "PENDING" && (
              <TableCell align="center">
                Actions
              </TableCell>
            )}
          </TableRow>
        </TableHead>

        <TableBody>
          {jobs.map((job) => (
            <>
              <TableRow key={job.id} hover>
                <TableCell width={48}>
                  <IconButton
                    size="small"
                    onClick={() => toggle(job.id)}
                  >
                    {openId === job.id ? (
                      <ExpandLessIcon />
                    ) : (
                      <ExpandMoreIcon />
                    )}
                  </IconButton>
                </TableCell>

                <TableCell>#{job.id}</TableCell>

                <TableCell>
                  {new Date(job.created_at).toLocaleString()}
                </TableCell>

                <TableCell>
                  {job.contacts.length}
                </TableCell>

                {status === "PENDING" && (
                  <TableCell align="center">
                    <IconButton
                      color="error"
                      size="small"
                      onClick={() =>
                        handleDelete(job.id)
                      }
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                )}
              </TableRow>

              <TableRow>
                <TableCell
                  colSpan={
                    status === "PENDING" ? 5 : 4
                  }
                  sx={{ p: 0 }}
                >
                  <Collapse in={openId === job.id}>
                    <Box sx={{ p: 2 }}>
                      <Typography variant="subtitle2">
                        Message
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          whiteSpace: "pre-wrap",
                        }}
                      >
                        {job.message}
                      </Typography>

                      <Typography
                        variant="subtitle2"
                        sx={{ mt: 2 }}
                      >
                        Recipients
                      </Typography>

                      {job.contacts.map((c) => (
                        <Typography
                          key={c.id}
                          variant="body2"
                        >
                          {c.name} — {c.phone}
                        </Typography>
                      ))}
                    </Box>
                  </Collapse>
                </TableCell>
              </TableRow>
            </>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}
