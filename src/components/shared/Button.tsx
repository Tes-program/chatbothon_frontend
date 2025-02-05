interface ButtonProps {
  label: string;
  variant?: "primary" | "secondary";
  onClick?: () => void;
  type?: "button" | "submit";
}

const Button: React.FC<ButtonProps> = ({
  label,
  variant = "primary",
  onClick,
  type = "button",

}) => {
  const styles = {
    primary: "bg-gradient-to-r from-[#6B2C0E] to-[#D1561B] hover:bg-[#E67E22] text-white",
    secondary:
      "border border-[#D35400] text-[#D35400] hover:bg-[#D35400] hover:text-white",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`w-full py-1 rounded-4xl transition-colors ${styles[variant]}`}
    >
      {label}
    </button>
  );
};

export default Button;
