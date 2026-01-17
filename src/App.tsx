import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Tabs, Tab } from "@mui/material";

import LoginPage from "./auth/LoginPage";
import ProtectedRoute from "./auth/ProtectedRoute";
import { useAuth } from "./auth/AuthContext";

import ContactForm from "./contacts/ContactForm";
import ContactList from "./contacts/ContactList";
import MessageComposer from "./messaging/MessageComposer";
import TemplateManager from "./messaging/TemplateManager";
import AppShell from "./layout/AppShell";
import JobsPage from "./jobs/JobsPage";


import {
  useContacts,
  useCreateContact,
  useUpdateContact,
  useDeleteContact,
} from "./hooks/useContacts";

const CATEGORIES: string[] = [
  "Landed Buyers",
  "New Launch Buyers",
  "Resale Buyers",
  "Existing Clients",
  "Potential Sellers",
];

export default function App() {
  const { logout } = useAuth();

  const [selectedCategory, setSelectedCategory] =
    useState<(typeof CATEGORIES)[number]>(CATEGORIES[0]);

  /* ---------------------------------
   * CONTACTS (TanStack Query)
   * ---------------------------------*/
  const {
    data: contacts = [],
    isLoading,
  } = useContacts(selectedCategory);

  const createContact = useCreateContact(selectedCategory);
  const updateContact = useUpdateContact(selectedCategory);
  const deleteContact = useDeleteContact(selectedCategory);

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
                {/* Category tabs */}
                <Tabs
                  value={selectedCategory}
                  onChange={(_, value) =>
                    setSelectedCategory(value)
                  }
                  sx={{ mb: 2 }}
                >
                  {CATEGORIES.map((cat) => (
                    <Tab
                      key={cat}
                      label={cat}
                      value={cat}
                    />
                  ))}
                </Tabs>

                {/* Create */}
                <ContactForm
                  categories={CATEGORIES}
                  onAdd={(data) =>
                    createContact.mutate(data)
                  }
                />

                {/* List */}
                <ContactList
                  contacts={contacts}
                  category={selectedCategory}
                  categories={CATEGORIES}
                  loading={isLoading}
                  onReassign={(id, cat) =>
                    updateContact.mutate({
                      id,
                      data: { category: cat },
                    })
                  }
                  onUpdate={(id, data) =>
                    updateContact.mutate({ id, data })
                  }
                  onDelete={(id) =>
                    deleteContact.mutate(id)
                  }
                />

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
                  categories={CATEGORIES}
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
          element={<Navigate to="/contacts" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}
