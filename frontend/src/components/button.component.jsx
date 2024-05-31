function Button({ color, onClick, children, className, type }) {
  return (
    <button
      type={type}
      className={`bg-customPrimary w-min-[327px] w-[100%] h-12 rounded-[15px] hover:bg-customSecondary ${className}`}
      onClick={onClick}
    >
      <div className="text-center text-white text-base font-bold leading-tight">
        {children}
      </div>
    </button>
  );
}
export default Button;
