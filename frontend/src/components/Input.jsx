function Input({ type, label, placeholder, onChange, value, id, error }) {
  return (
    <div className="">
      <label className="text-black text-xs font-extrabold leading-none mb-2">
        {label}
      </label>
      <input
        type={type}
        id={id}
        placeholder={placeholder}
        onChange={onChange}
        value={value}
        className="w-[327px] h-12 relative bg-white rounded-[15px] border border-neutral-300 text-customDark text-base font-normal leading-normal pl-4"
      />
      <div>
        <h5 className="font-light font-xs text-customLight">{error}</h5>
      </div>
    </div>
  );
}
export default Input;
