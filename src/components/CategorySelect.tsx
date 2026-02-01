import { MenuItem, Select } from "@mui/material";
import { Category } from "../api/categories";

type Props = {
  categories: Category[];
  value: number | null;
  onChange: (categoryId: number) => void;
  size?: "small" | "medium";
};

export default function CategorySelect({
  categories,
  value,
  onChange,
  size = "small",
}: Props) {
  return (
    <Select
      size={size}
      value={value ?? ""}
      onChange={(e) =>
        onChange(Number(e.target.value))
      }
      displayEmpty
      fullWidth
    >
      {categories.map((cat) => (
        <MenuItem key={cat.id} value={cat.id}>
          {cat.name}
        </MenuItem>
      ))}
    </Select>
  );
}
