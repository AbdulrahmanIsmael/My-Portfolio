import Link from "next/link";

const BtnLink = ({
  children,
  clickHandler,
  className,
  href = ".",
}: {
  children: React.ReactNode;
  clickHandler?: () => void;
  className?: string;
  href?: string;
}) => {
  return (
    <Link
      href={href}
      onClick={clickHandler}
      className={`${className} cursor-pointer bg-accentLight hover:bg-accentHoverLight text-textLight font-semibold py-2 px-4 rounded-lg transition-colors duration-300`}
    >
      {children}
    </Link>
  );
};

export default BtnLink;
