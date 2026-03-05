import { IssueStatus } from "../constants";

export const Input: React.FC<{
    isDisabled?: boolean;
    label: string;
    placeholder?: string;
    type?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    multiline?: boolean;
    options?: { label: string; value: string }[];
}> = ({ isDisabled, label, placeholder, type = 'text', multiline, options, value, onChange }) => (
    <div className="space-y-1.5">
        <label className="text-sm font-medium text-slate-700">{label}</label>
        {options ? (
            <select
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all text-slate-700"
                {...(onChange ? { value, onChange } : { defaultValue: value })}
            >
                {options.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
            </select>
        ) : multiline ? (
            <textarea
                rows={4}
                placeholder={placeholder}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all text-slate-700"
                {...(onChange ? { value, onChange } : { defaultValue: value })}
            />
        ) : (
            <input
                type={type}
                placeholder={placeholder}
                disabled={isDisabled}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all text-slate-700"
                {...(onChange ? { value, onChange } : { defaultValue: value })}
            />
        )}
    </div>
);

type Priority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"

export const PriorityBadge: React.FC<{ priority: Priority }> = ({ priority }) => {
  const styles = {
    LOW: 'text-slate-500 bg-slate-50',
    MEDIUM: 'text-blue-600 bg-blue-50',
    HIGH: 'text-orange-600 bg-orange-50',
    CRITICAL: 'text-red-700 bg-red-100 animate-pulse',
  };

  return (
    <span className={`px-2 py-0.5 text-[9px] font-black uppercase tracking-tighter rounded border border-transparent ${styles[priority]}`}>
      {priority}
    </span>
  );
};

export const StatusBadge: React.FC<{ status: IssueStatus }> = ({ status }) => {
  const styles: Record<IssueStatus, string> = {
    'pending': 'bg-amber-50 text-amber-700 border-amber-200',
    'in-progress': 'bg-blue-50 text-blue-700 border-blue-200',
    'resolved': 'bg-teal-50 text-teal-700 border-teal-200',
    'rejected': 'bg-rose-50 text-rose-700 border-rose-200',
  };

  // Convert 'in-progress' to 'In Progress', 'pending' to 'Pending', etc.
  const displayText = status
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${styles[status]}`}>
      {displayText}
    </span>
  );
};

export const Card: React.FC<{ title?: string; children: React.ReactNode; className?: string }> = ({ title, children, className = '' }) => (
  <div className={` rounded-xl shadow-sm border border-slate-200 overflow-hidden ${className}`}>
    {title && (
      <div className="px-6 py-4 border-b border-slate-100">
        <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
      </div>
    )}
    <div className="p-6">{children}</div>
  </div>
);

export const Button: React.FC<{ 
  children: React.ReactNode; 
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit';
  disabled?: boolean;
}> = ({ children, variant = 'primary', onClick, className = '', type = 'button', disabled }) => {
  const base = "px-6 py-2.5 rounded-lg font-semibold transition-all duration-200 active:scale-[0.98] disabled:opacity-50 text-sm";
  const variants = {
    primary: "bg-teal-600 text-white hover:bg-teal-700 shadow-teal-200/50 shadow-md",
    secondary: "bg-slate-800 text-white hover:bg-slate-900 shadow-slate-200/50 shadow-md",
    outline: "border border-slate-200 text-slate-600 hover:bg-slate-50",
    danger: "bg-rose-600 text-white hover:bg-rose-700 shadow-rose-200/50 shadow-md",
  };

  return (
    <button type={type} onClick={onClick} className={`${base} ${variants[variant]} ${className}`} disabled={disabled}>
      {children}
    </button>
  );
};
