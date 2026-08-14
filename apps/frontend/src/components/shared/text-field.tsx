import { LucideIcon } from "lucide-react";

interface TextFieldProps {
  label: string;
  name: string;
  icon?: LucideIcon;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}
export default function TextField({ label, name, icon: Icon, type = "text", placeholder, value, onChange, required } : TextFieldProps) {
  return (
    <div className="mb-4">
      <label className="mb-1.5 block text-xs text-muted-foreground">{label}</label>
      <div className="flex items-center gap-2.5 rounded-xl border border-input bg-input/30 px-3.5 focus-within:border-primary">
        {Icon && <Icon size={16} className="text-muted-foreground" />}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          name={name}
          className="min-w-0 flex-1 bg-transparent py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground/70"
        />
      </div>
    </div>
  );
}
