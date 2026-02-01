import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import {
  Box,
  Paper,
  Stack,
  List,
  ListItemButton,
  Typography,
  CircularProgress,
} from "@mui/material";

import LoginPage from "./auth/LoginPage";
import ProtectedRoute from "./auth/ProtectedRoute";
import { useAuth } from "./auth/AuthContext";

import AppShell from "./layout/AppShell";
import CategoriesPage from "./categories/CategoriesPage";
import ContactForm from "./contacts/ContactForm";
import ContactList from "./contacts/ContactList";
import MessageComposer from "./messaging/MessageComposer";
import TemplateManager from "./messaging/TemplateManager";
import JobsPage from "./jobs/JobsPage";

import {
  useContacts,
  useCreateContact,
  useUpdateContact,
  useDeleteContact,
} from "./hooks/useContacts";

import { useCategories } from "./hooks/useCategories";

export default function App() {
  const { logout } = useAuth();

  /* ---------------------------------
   * Categories
   * --------------------------------- */
  const {
    data: categories = [],
    isLoading: categoriesLoading,
  } = useCategories();

  const [selectedCategoryId, setSelectedCategoryId] =
    useState<number | null>(null);

  // Auto-select first category once loaded
  useEffect(() => {
    if (
      !selectedCategoryId &&
      categories.length > 0
    ) {
      setSelectedCategoryId(categories[0].id);
    }
  }, [categories, selectedCategoryId]);

  /* ---------------------------------
   * Contacts
   * --------------------------------- */
  const {
    data: contacts = [],
    isLoading: contactsLoading,
  } = useContacts(selectedCategoryId);

  const createContact = useCreateContact();
  const updateContact = useUpdateContact();
  const deleteContact = useDeleteContact();

  return (
    <BrowserRouter>
      <Routes>
        {/* ---------- PUBLIC ---------- */}
        <Route path="/login" element={<LoginPage />} />

        {/* ---------- CONTACTS ---------- */}
        <Route
          path="/contacts"
          element={
            <ProtectedRoute>
              <AppShell onLogout={logout}>
                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="stretch"
                >
                  {/* ---------- CATEGORY SIDEBAR ---------- */}
                  <Paper
                    sx={{
                      width: 240,
                      p: 1,
                      flexShrink: 0,
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      sx={{ px: 1, mb: 1 }}
                    >
                      Categories
                    </Typography>

                    {categoriesLoading ? (
                      <Box
                        display="flex"
                        justifyContent="center"
                        py={2}
                      >
                        <CircularProgress size={20} />
                      </Box>
                    ) : (
                      <List dense>
                        {categories.map((cat) => (
                          <ListItemButton
                            key={cat.id}
                            selected={
                              cat.id ===
                              selectedCategoryId
                            }
                            onClick={() =>
                              setSelectedCategoryId(
                                cat.id
                              )
                            }
                          >
                            {cat.name}
                          </ListItemButton>
                        ))}
                      </List>
                    )}
                  </Paper>

                  {/* ---------- MAIN CONTENT ---------- */}
                  <Box flex={1}>
                    {selectedCategoryId && (
                      <>
                        {/* Create Contact */}
                        <ContactForm
                          categories={categories}
                          onAdd={(data) =>
                            createContact.mutate(data)
                          }
                        />

                        {/* Contact List */}
                        <ContactList
                          contacts={contacts}
                          categoryId={
                            selectedCategoryId
                          }
                          categories={categories}
                          loading={contactsLoading}
                          onReassign={(
                            id,
                            categoryId
                          ) =>
                            updateContact.mutate({
                              id,
                              data: {
                                category_id:
                                  categoryId,
                              },
                            })
                          }
                          onUpdate={(id, data) =>
                            updateContact.mutate({
                              id,
                              data,
                            })
                          }
                          onDelete={(id) =>
                            deleteContact.mutate(id)
                          }
                        />
                      </>
                    )}
                  </Box>
                </Stack>
              </AppShell>
            </ProtectedRoute>
          }
        />


      <Route
        path="/categories"
        element={
          <ProtectedRoute>
            <AppShell onLogout={logout}>
              <CategoriesPage />
            </AppShell>
          </ProtectedRoute>
        }
      />


        {/* ---------- MESSAGES ---------- */}
        <Route
          path="/messages"
          element={
            <ProtectedRoute>
              <AppShell onLogout={logout}>
                <MessageComposer
                  categories={categories}
                />
              </AppShell>
            </ProtectedRoute>
          }
        />

        {/* ---------- TEMPLATES ---------- */}
        <Route
          path="/templates"
          element={
            <ProtectedRoute>
              <AppShell onLogout={logout}>
                <TemplateManager />
              </AppShell>
            </ProtectedRoute>
          }
        />

        {/* ---------- JOBS ---------- */}
        <Route
          path="/jobs"
          element={
            <ProtectedRoute>
              <AppShell onLogout={logout}>
                <JobsPage />
              </AppShell>
            </ProtectedRoute>
          }
        />

        {/* ---------- DEFAULT ---------- */}
        <Route
          path="*"
          element={
            <Navigate to="/contacts" replace />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
