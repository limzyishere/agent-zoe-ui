import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Paper,
  Stack,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

import {
  useTemplates,
  useCreateTemplate,
  useUpdateTemplate,
  useDeleteTemplate,
} from "../hooks/useTemplates";
import type { Template } from "../api/templates";

export default function TemplateManager() {
  const { data: templates = [], isLoading } = useTemplates();
  const createTemplate = useCreateTemplate();
  const updateTemplate = useUpdateTemplate();
  const deleteTemplate = useDeleteTemplate();

  const [selected, setSelected] = useState<Template | null>(null);
  const [name, setName] = useState("");
  const [content, setContent] = useState("");

  function selectTemplate(t: Template) {
    setSelected(t);
    setName(t.name);
    setContent(t.content);
  }

  function clear() {
    setSelected(null);
    setName("");
    setContent("");
  }

  return (
    <Box sx={{ display: "flex", gap: 3, width: "100%" }}>
      {/* LEFT */}
      <Paper sx={{ width: 320, p: 2 }}>
        <Typography variant="h6">Templates</Typography>

        {isLoading && (
          <Typography variant="body2">Loading…</Typography>
        )}

        <List dense>
          {templates.map((t) => (
            <ListItem
              key={t.id}
              selected={selected?.id === t.id}
              onClick={() => selectTemplate(t)}
              sx={{ cursor: "pointer" }}
              secondaryAction={
                <IconButton
                  edge="end"
                  onClick={() =>
                    deleteTemplate.mutate(t.id)
                  }
                >
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemText primary={t.name} />
            </ListItem>
          ))}
        </List>
      </Paper>

      {/* RIGHT */}
      <Paper sx={{ flex: 1, p: 3 }}>
        <Stack spacing={2}>
          <Typography variant="h6">
            {selected ? "Edit Template" : "New Template"}
          </Typography>

          <TextField
            placeholder="Template name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <TextField
            placeholder="Message content"
            multiline
            minRows={6}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          <Divider />

          <Stack direction="row" spacing={2}>
            {!selected && (
              <Button
                variant="contained"
                onClick={() =>
                  createTemplate.mutate({
                    name,
                    content,
                  })
                }
                disabled={!name || !content}
              >
                Create
              </Button>
            )}

            {selected && (
              <Button
                variant="contained"
                onClick={() =>
                  updateTemplate.mutate({
                    id: selected.id,
                    data: { name, content },
                  })
                }
              >
                Save Changes
              </Button>
            )}

            <Button variant="outlined" onClick={clear}>
              Clear
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Box>
  );
}
