import { useEffect, useState } from "react";
import {
  Box,
  TextField,
  MenuItem,
  Typography,
  Button,
  Paper,
  Stack,
  Divider,
} from "@mui/material";

import { fetchTemplates } from "../api/templates";
import type { Template } from "../api/templates";
import { createJob } from "../api/jobs";
import { fetchContactsByCategory } from "../api/contacts";

type Contact = {
  id: number;
  name: string;
  phone: string;
  email?: string | null;
  category: string;
};

type Props = {
  categories: string[];
};

export default function MessageComposer({ categories }: Props) {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [templateId, setTemplateId] = useState<number | "">("");
  const [message, setMessage] = useState("");

  const [category, setCategory] = useState(categories[0]);
  const [contacts, setContacts] = useState<Contact[]>([]);

  const [sending, setSending] = useState(false);

  /* -----------------------------------------
   * Load templates once
   * ---------------------------------------*/
  useEffect(() => {
    fetchTemplates().then(setTemplates);
  }, []);

  /* -----------------------------------------
   * Load contacts when category changes
   * ---------------------------------------*/
  useEffect(() => {
    fetchContactsByCategory(category).then(setContacts);
  }, [category]);

  /* -----------------------------------------
   * Apply template content
   * ---------------------------------------*/
  function applyTemplate(id: number) {
    const t = templates.find((x) => x.id === id);
    if (t) {
      setMessage(t.content);
    }
  }

  /* -----------------------------------------
   * Send → create PropertyJob
   * ---------------------------------------*/
  async function send() {
    if (!message || contacts.length === 0) return;

    setSending(true);

    try {
      await createJob({
        message,
        contact_ids: contacts.map((c) => c.id),
      });

      alert(`Job created for ${contacts.length} contacts`);
      setMessage("");
      setTemplateId("");
    } finally {
      setSending(false);
    }
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Stack spacing={3}>
        <Typography variant="h6">
          Message Composer
        </Typography>

        {/* Recipient category */}
        <TextField
          select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {categories.map((c) => (
            <MenuItem key={c} value={c}>
              {c}
            </MenuItem>
          ))}
        </TextField>

        <Typography variant="body2" color="text.secondary">
          {contacts.length} recipients in this category
        </Typography>

        <Divider />

        {/* Template selector */}
        <TextField
          select
          value={templateId}
          onChange={(e) => {
            const id = Number(e.target.value);
            setTemplateId(id);
            applyTemplate(id);
          }}
          displayEmpty
        >
          <MenuItem value="">
            No template
          </MenuItem>

          {templates.map((t) => (
            <MenuItem key={t.id} value={t.id}>
              {t.name}
            </MenuItem>
          ))}
        </TextField>

        {/* Message editor */}
        <TextField
          multiline
          minRows={6}
          placeholder="Write your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <Typography variant="caption" color="text.secondary">
          {message.length} characters
        </Typography>

        <Divider />

        {/* Recipient preview */}
        <Box>
          <Typography variant="subtitle2">
            Preview recipients
          </Typography>

          <Typography variant="body2" color="text.secondary">
            {contacts.length === 0
              ? "No contacts in this category"
              : contacts
                  .slice(0, 5)
                  .map((c) => c.name)
                  .join(", ") +
                (contacts.length > 5 ? "…" : "")}
          </Typography>
        </Box>

        {/* Send */}
        <Button
          variant="contained"
          disabled={
            sending || !message || contacts.length === 0
          }
          onClick={send}
        >
          {sending ? "Sending…" : "Send Message"}
        </Button>
      </Stack>
    </Paper>
  );
}


