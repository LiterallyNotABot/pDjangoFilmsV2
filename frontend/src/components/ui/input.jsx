export function Input({ type = 'text', placeholder, value, onChange, ...props }) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full p-2 border rounded"
      {...props}
    />
  );
}
