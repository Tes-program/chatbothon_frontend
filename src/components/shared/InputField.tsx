import React from "react";

interface InputProps {
  name: string;
  type: string;
  placeholder: string;
  required: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input: React.FC<InputProps> = ({
  name,
  type,
  placeholder,
  onChange,
  required,
}) => {
  return (
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      onChange={onChange}
      required={required}
      className="w-full !bg-[#404040] text-white rounded-4xl px-4 py-3 mb-4 border-none focus:outline-none focus:border-[#3A3A3A] placeholder-gray-500"
      style={{
        borderImageSource: 'linear-gradient(90.57deg, #FFFFFF 3.52%, #999999 94.72%)',
        borderImageSlice: '1'
      }}
    />
  );
};

export default Input;
