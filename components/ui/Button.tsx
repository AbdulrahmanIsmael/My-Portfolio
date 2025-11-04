const Button = ({
  children,
  clickHandler,
  className,
}: {
  children: React.ReactNode;
  clickHandler?: () => void;
  className?: string;
}) => {
  return (
    <button
      type="button"
      onClick={clickHandler}
      className={`${className} cursor-pointer bg-accentLight hover:bg-accentHoverLight text-textLight font-semibold py-2 px-4 rounded-lg transition-colors duration-300`}
    >
      {children}
    </button>
  );
};

export default Button;
