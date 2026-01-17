import { useState } from "react";
import {
  Box,
  TextField,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Select,
  MenuItem,
  IconButton,
  Typography,
  Tooltip,
  Stack,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";

type Contact = {
  id: number;
  name: string;
  phone: string;
  email?: string | null;
  propertyInterest?: string | null;
  category: string;
};

type Props = {
  contacts: Contact[];
  category: string;
  categories: string[];
  loading?: boolean;
  onReassign: (id: number, category: string) => void;
  onUpdate: (
    id: number,
    data: Partial<Omit<Contact, "id">>
  ) => void;
  onDelete: (id: number) => void;
};

function isValidPhone(phone: string) {
  return /^\+\d{8,15}$/.test(phone);
}

export default function ContactList({
  contacts,
  category,
  categories,
  loading,
  onReassign,
  onUpdate,
  onDelete,
}: Props) {
  const [query, setQuery] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [draft, setDraft] =
    useState<Partial<Contact>>({});

  const filtered = contacts
    .filter((c) => c.category === category)
    .filter((c) => {
      const q = query.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.phone.includes(query) ||
        (c.email?.toLowerCase().includes(q) ??
          false) ||
        (c.propertyInterest
          ?.toLowerCase()
          .includes(q) ??
          false)
      );
    });

  function startEdit(c: Contact) {
    setEditingId(c.id);
    setDraft({ ...c });
  }

  function cancelEdit() {
    setEditingId(null);
    setDraft({});
  }

  function saveEdit(id: number) {
    if (
      draft.phone &&
      !isValidPhone(draft.phone)
    ) {
      alert(
        "Invalid phone number. Use +XXXXXXXX format."
      );
      return;
    }

    onUpdate(id, {
      name: draft.name,
      phone: draft.phone,
      email: draft.email,
      propertyInterest: draft.propertyInterest,
    });

    cancelEdit();
  }

  function handleDelete(id: number, name: string) {
    const ok = window.confirm(
      `Delete contact "${name}"?\nThis cannot be undone.`
    );
    if (!ok) return;

    onDelete(id);
  }

  return (
    <Box sx={{ width: "100%" }}>
      <TextField
        placeholder="Search contacts"
        fullWidth
        sx={{ mb: 2 }}
        value={query}
        onChange={(e) =>
          setQuery(e.target.value)
        }
      />

      <Paper sx={{ width: "100%", overflowX: "auto" }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Property Interest</TableCell>
              <TableCell>Category</TableCell>
              <TableCell
                align="center"
                sx={{ width: 120 }}
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {loading && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  align="center"
                >
                  Loading…
                </TableCell>
              </TableRow>
            )}

            {filtered.map((c) => {
              const isEditing =
                editingId === c.id;

              return (
                <TableRow key={c.id} hover>
                  <TableCell>
                    {isEditing ? (
                      <TextField
                        size="small"
                        value={draft.name || ""}
                        onChange={(e) =>
                          setDraft({
                            ...draft,
                            name: e.target.value,
                          })
                        }
                      />
                    ) : (
                      c.name
                    )}
                  </TableCell>

                  <TableCell>
                    {isEditing ? (
                      <TextField
                        size="small"
                        error={
                          draft.phone
                            ? !isValidPhone(
                                draft.phone
                              )
                            : false
                        }
                        value={draft.phone || ""}
                        onChange={(e) =>
                          setDraft({
                            ...draft,
                            phone: e.target.value,
                          })
                        }
                      />
                    ) : (
                      <Typography
                        color={
                          isValidPhone(c.phone)
                            ? "text.primary"
                            : "error"
                        }
                      >
                        {c.phone}
                      </Typography>
                    )}
                  </TableCell>

                  <TableCell>
                    {isEditing ? (
                      <TextField
                        size="small"
                        value={draft.email || ""}
                        onChange={(e) =>
                          setDraft({
                            ...draft,
                            email: e.target.value,
                          })
                        }
                      />
                    ) : (
                      c.email || "—"
                    )}
                  </TableCell>

                  <TableCell>
                    {isEditing ? (
                      <TextField
                        size="small"
                        value={
                          draft.propertyInterest ||
                          ""
                        }
                        onChange={(e) =>
                          setDraft({
                            ...draft,
                            propertyInterest:
                              e.target.value,
                          })
                        }
                      />
                    ) : (
                      c.propertyInterest || "—"
                    )}
                  </TableCell>

                  <TableCell>
                    <Select
                      size="small"
                      value={c.category}
                      onChange={(e) =>
                        onReassign(
                          c.id,
                          e.target.value
                        )
                      }
                    >
                      {categories.map((cat) => (
                        <MenuItem
                          key={cat}
                          value={cat}
                        >
                          {cat}
                        </MenuItem>
                      ))}
                    </Select>
                  </TableCell>

                  <TableCell align="center">
                    {isEditing ? (
                      <Stack
                        direction="row"
                        spacing={1}
                        justifyContent="center"
                      >
                        <IconButton
                          color="primary"
                          onClick={() =>
                            saveEdit(c.id)
                          }
                        >
                          <SaveIcon />
                        </IconButton>
                        <IconButton
                          onClick={cancelEdit}
                        >
                          <CloseIcon />
                        </IconButton>
                      </Stack>
                    ) : (
                      <Stack
                        direction="row"
                        spacing={1}
                        justifyContent="center"
                      >
                        <IconButton
                          onClick={() =>
                            startEdit(c)
                          }
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() =>
                            handleDelete(
                              c.id,
                              c.name
                            )
                          }
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Stack>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}
