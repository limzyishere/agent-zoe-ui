import { useState } from "react";
import {
  TextField,
  Button,
  MenuItem,
  Stack,
  Paper,
  Box,
} from "@mui/material";

const COUNTRY_CODES = [
  { code: "+65", label: "Singapore", flag: "🇸🇬" },
  { code: "+60", label: "Malaysia", flag: "🇲🇾" },
  { code: "+62", label: "Indonesia", flag: "🇮🇩" },
  { code: "+66", label: "Thailand", flag: "🇹🇭" },
  { code: "+63", label: "Philippines", flag: "🇵🇭" },
  { code: "+84", label: "Vietnam", flag: "🇻🇳" },
  { code: "+86", label: "China", flag: "🇨🇳" },
  { code: "+852", label: "Hong Kong", flag: "🇭🇰" },
  { code: "+886", label: "Taiwan", flag: "🇹🇼" },
  { code: "+81", label: "Japan", flag: "🇯🇵" },
  { code: "+82", label: "South Korea", flag: "🇰🇷" },
  { code: "+1", label: "USA / Canada", flag: "🇺🇸" },
  { code: "+44", label: "United Kingdom", flag: "🇬🇧" },
  { code: "+61", label: "Australia", flag: "🇦🇺" },
];

type Props = {
  onAdd: (data: {
    name: string;
    phone: string;
    email?: string;
    category: string;
  }) => void;
  categories: string[];
};

export default function ContactForm({ onAdd, categories }: Props) {
  const [form, setForm] = useState({
    name: "",
    countryCode: "+65", // 🇸🇬 default
    phoneLocal: "",
    email: "",
    propertyInterest: "",
    category: categories[0],
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const fullPhone = `${form.countryCode}${form.phoneLocal}`;

    onAdd({
      name: form.name,
      phone: fullPhone,
      email: form.email || undefined,
      propertyInterest: form.propertyInterest || undefined,
      category: form.category,
    });

    setForm({
      ...form,
      name: "",
      phoneLocal: "",
      email: "",
      propertyInterest: "",
    });
  }

  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          {/* Name */}
          <TextField
            placeholder="Name"
            required
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

          {/* Phone (flag + number, no labels) */}
          <Box sx={{ display: "flex", gap: 1 }}>
            <TextField
              select
              value={form.countryCode}
              onChange={(e) =>
                setForm({
                  ...form,
                  countryCode: e.target.value,
                })
              }
              sx={{ width: 110 }}
            >
              {COUNTRY_CODES.map((c) => (
                <MenuItem key={c.code} value={c.code}>
                  {c.flag} {c.code}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              fullWidth
              required
              placeholder="Phone number"
              value={form.phoneLocal}
              onChange={(e) =>
                setForm({
                  ...form,
                  phoneLocal: e.target.value.replace(/\D/g, ""),
                })
              }
            />
          </Box>

          {/* Email */}
          <TextField
            placeholder="Email (optional)"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />

 
          {/* Category */}
          <TextField
            select
            value={form.category}
            onChange={(e) =>
              setForm({
                ...form,
                category: e.target.value,
              })
            }
          >
            {categories.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </TextField>

          <Button variant="contained" type="submit">
            Add Contact
          </Button>
        </Stack>
      </form>
    </Paper>
  );
}
