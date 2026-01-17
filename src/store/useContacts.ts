import { useEffect, useState } from "react";
import * as contactsApi from "../api/contacts";

export type Contact = {
  id: number;
  name: string;
  phone: string;
  email?: string;
  category: string;
};

export function useContacts(category: string) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);

  async function loadContacts() {
    setLoading(true);
    try {
      const data =
        await contactsApi.fetchContactsByCategory(category);
      setContacts(data);
    } finally {
      setLoading(false);
    }
  }

  async function addContact(data: Omit<Contact, "id">) {
    const created = await contactsApi.createContact(data);

    // only add if it belongs to current category
    if (created.category === category) {
      setContacts((prev) => [created, ...prev]);
    }
  }

  async function updateContact(
    id: number,
    data: Partial<Omit<Contact, "id">>
  ) {
    const updated = await contactsApi.updateContact(id, data);

    // moved to another category → remove
    if (updated.category !== category) {
      setContacts((prev) => prev.filter((c) => c.id !== id));
    } else {
      setContacts((prev) =>
        prev.map((c) => (c.id === id ? updated : c))
      );
    }
  }

  async function removeContact(id: number) {
    await contactsApi.deleteContact(id);
    setContacts((prev) => prev.filter((c) => c.id !== id));
  }

  useEffect(() => {
    loadContacts();
  }, [category]);

  return {
    contacts,
    loading,
    addContact,
    updateContact,
    removeContact,
    reload: loadContacts,
  };
}
