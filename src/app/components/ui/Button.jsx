export default function Button({
  children,
  className="",
  ...props
}) {
  return (
    <button
      {...props}
      className={`px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition ${className}`}
    >
      {children}
    </button>
  );
}
