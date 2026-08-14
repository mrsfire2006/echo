import { useState } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";
interface PasswordFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}
export default function PasswordField({ label, name, value, onChange, placeholder }: PasswordFieldProps) {
  const [show, setShow] = useState(false);

  return (
    <div className="mb-4">
      <label className="mb-1.5 block text-xs text-muted-foreground">{label}</label>
      <div className="flex items-center gap-2.5 rounded-xl border border-input bg-input/30 px-3.5 focus-within:border-primary">
        <Lock size={16} className="text-muted-foreground" />
        <input
          type={show ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          name={name}

          className="min-w-0 flex-1 bg-transparent py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground/70"
        />
        <button
          type="button"
          tabIndex={-1}
          onClick={() => setShow((s) => !s)}
          aria-label="إظهار كلمة المرور"
          className="flex items-center p-1 text-muted-foreground hover:text-foreground focus-visible:outline-2 focus-visible:outline-primary"
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </div>
  );
}
