function Input({
  type,
  label,
  placeholder,
  onChange,
  value,
  id,
  error,
  innerRef,
  className,
  ...rest
}) {
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          {label}
        </label>
      )}
      <input
        ref={innerRef}
        type={type}
        id={id}
        placeholder={placeholder}
        onChange={onChange}
        value={value}
        className={`w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
          error ? "border-red-500" : ""
        }`}
        {...rest}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

export default Input;
