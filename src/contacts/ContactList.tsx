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
  Stack,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";

/* -----------------------------
 * Types
 * ----------------------------- */
type Category = {
  id: number;
  name: string;
};

type Contact = {
  id: number;
  name: string;
  phone: string;
  email?: string | null;
  category_id: number;
};

type Props = {
  contacts: Contact[];
  categoryId: number;
  categories: Category[];
  loading?: boolean;
  onReassign: (id: number, categoryId: number) => void;
  onUpdate: (
    id: number,
    data: Partial<Omit<Contact, "id">>
  ) => void;
  onDelete: (id: number) => void;
};

/* -----------------------------
 * Helpers
 * ----------------------------- */
function isValidPhone(phone: string) {
  return /^\+\d{8,15}$/.test(phone);
}

/* -----------------------------
 * Component
 * ----------------------------- */
export default function ContactList({
  contacts,
  categoryId,
  categories,
  loading,
  onReassign,
  onUpdate,
  onDelete,
}: Props) {
  const [query, setQuery] = useState("");
  const [editingId, setEditingId] =
    useState<number | null>(null);
  const [draft, setDraft] =
    useState<Partial<Contact>>({});

  /* ---------------------------------
   * Search filter ONLY
   * (Backend already filters by category)
   * --------------------------------- */
  const filtered = contacts.filter((c) => {
    const q = query.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.phone.includes(query) ||
      (c.email?.toLowerCase().includes(q) ??
        false)
    );
  });

  /* ---------------------------------
   * Edit helpers
   * --------------------------------- */
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

  /* ---------------------------------
   * Render
   * --------------------------------- */
  return (
    <Box sx={{ width: "100%" }}>
      {/* Search */}
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
            {/* Loading */}
            {loading && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  align="center"
                >
                  Loading…
                </TableCell>
              </TableRow>
            )}

            {/* Rows */}
            {filtered.map((c) => {
              const isEditing =
                editingId === c.id;

              return (
                <TableRow key={c.id} hover>
                  {/* Name */}
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

                  {/* Phone */}
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

                  {/* Email */}
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

                  {/* Category (ID-based, SAFE) */}
                  <TableCell>
                    <Select
                      size="small"
                      value={c.category_id}
                      onChange={(e) =>
                        onReassign(
                          c.id,
                          Number(e.target.value)
                        )
                      }
                    >
                      {categories.map((cat) => (
                        <MenuItem
                          key={cat.id}
                          value={cat.id}
                        >
                          {cat.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </TableCell>

                  {/* Actions */}
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

            {/* Empty */}
            {!loading && filtered.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  align="center"
                >
                  No contacts found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}
