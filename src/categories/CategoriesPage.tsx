import { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
  List,
  ListItem,
  IconButton,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";

import {
  useCategories,
  useCreateCategory,
  useUpdateCategory,
} from "../hooks/useCategories";

/* -----------------------------
 * Component
 * ----------------------------- */
export default function CategoriesPage() {
  const { data: categories = [], isLoading } =
    useCategories();

  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();

  const [newName, setNewName] = useState("");

  const [editingId, setEditingId] =
    useState<number | null>(null);
  const [draftName, setDraftName] =
    useState("");

  /* ---------------------------------
   * Create
   * --------------------------------- */
  function handleCreate() {
    if (!newName.trim()) return;

    createCategory.mutate(
      { name: newName.trim() },
      {
        onSuccess: () => setNewName(""),
        onError: (e: any) =>
          alert(
            e?.message ??
              "Category already exists"
          ),
      }
    );
  }

  /* ---------------------------------
   * Edit
   * --------------------------------- */
  function startEdit(id: number, name: string) {
    setEditingId(id);
    setDraftName(name);
  }

  function cancelEdit() {
    setEditingId(null);
    setDraftName("");
  }

  function saveEdit(id: number) {
    if (!draftName.trim()) return;

    updateCategory.mutate(
      { id, name: draftName.trim() },
      {
        onSuccess: cancelEdit,
        onError: (e: any) =>
          alert(
            e?.message ??
              "Category name already in use"
          ),
      }
    );
  }

  /* ---------------------------------
   * Render
   * --------------------------------- */
  return (
    <Paper sx={{ p: 3, maxWidth: 600 }}>
      <Stack spacing={3}>
        <Typography variant="h6">
          Categories
        </Typography>

        {/* Create */}
        <Stack direction="row" spacing={1}>
          <TextField
            fullWidth
            placeholder="New category name"
            value={newName}
            onChange={(e) =>
              setNewName(e.target.value)
            }
          />
          <Button
            variant="contained"
            onClick={handleCreate}
            disabled={createCategory.isLoading}
          >
            Add
          </Button>
        </Stack>

        {/* List */}
        <Box>
          {isLoading && (
            <Typography
              color="text.secondary"
            >
              Loading…
            </Typography>
          )}

          <List dense>
            {categories.map((cat) => {
              const isEditing =
                editingId === cat.id;

              return (
                <ListItem
                  key={cat.id}
                  secondaryAction={
                    isEditing ? (
                      <>
                        <IconButton
                          color="primary"
                          onClick={() =>
                            saveEdit(cat.id)
                          }
                        >
                          <SaveIcon />
                        </IconButton>
                        <IconButton
                          onClick={cancelEdit}
                        >
                          <CloseIcon />
                        </IconButton>
                      </>
                    ) : (
                      <IconButton
                        onClick={() =>
                          startEdit(
                            cat.id,
                            cat.name
                          )
                        }
                      >
                        <EditIcon />
                      </IconButton>
                    )
                  }
                >
                  {isEditing ? (
                    <TextField
                      size="small"
                      value={draftName}
                      onChange={(e) =>
                        setDraftName(
                          e.target.value
                        )
                      }
                      autoFocus
                    />
                  ) : (
                    <Typography>
                      {cat.name}
                    </Typography>
                  )}
                </ListItem>
              );
            })}

            {!isLoading &&
              categories.length === 0 && (
                <Typography
                  color="text.secondary"
                >
                  No categories yet
                </Typography>
              )}
          </List>
        </Box>
      </Stack>
    </Paper>
  );
}
