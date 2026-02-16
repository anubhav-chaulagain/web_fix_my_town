export const Input: React.FC<{ isDisabled: boolean; label: string; placeholder?: string; type?: string; value?: string; onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void; multiline?: boolean; options?: {label: string, value: string}[] }> = ({isDisabled, label, placeholder, type = 'text', multiline, options, value, onChange }) => (
  <div className="space-y-1.5">
    <label className="text-sm font-medium text-slate-700">{label}</label>
    {options ? (
      <select 
        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all text-slate-700"
        value={value}
        onChange={onChange}
      >
        {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
      </select>
    ) : multiline ? (
      <textarea 
        rows={4}
        placeholder={placeholder}
        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all text-slate-700"
        value={value}
        onChange={onChange}
      />
    ) : (
      <input 
        type={type}
        placeholder={placeholder}
        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all text-slate-700"
        value={value}
        onChange={onChange}
        disabled={isDisabled}
      />
    )}
  </div>
);

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
}> = ({ children, variant = 'primary', onClick, className = '', type = 'button' }) => {
  const base = "px-6 py-2.5 rounded-lg font-semibold transition-all duration-200 active:scale-[0.98] disabled:opacity-50 text-sm";
  const variants = {
    primary: "bg-teal-600 text-white hover:bg-teal-700 shadow-teal-200/50 shadow-md",
    secondary: "bg-slate-800 text-white hover:bg-slate-900 shadow-slate-200/50 shadow-md",
    outline: "border border-slate-200 text-slate-600 hover:bg-slate-50",
    danger: "bg-rose-600 text-white hover:bg-rose-700 shadow-rose-200/50 shadow-md",
  };

  return (
    <button type={type} onClick={onClick} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};
