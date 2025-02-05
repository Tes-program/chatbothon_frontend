import React, { useState } from "react";
import chatbot_image from "../assets/images/chatbot_image.svg";
import { Link } from "react-router-dom";
import Input from "../components/shared/InputField";
import Button from "../components/shared/Button";
import authField from "../constant/authForm";

const SignUp: React.FC = () => {
  interface Field {
    name: string;
    type: string;
    placeholder: string;
    required: boolean;
  }

  const authFields: Field[] = authField;
  let fieldState: { [key: string]: string } = {};
  authField.forEach((field: Field) => {
    fieldState = {
      ...fieldState,
      [field.name]: '',
    };
  });
  const [form, setForm] = useState(fieldState)
  const handleChange= (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }
  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gradient-to-br from-[#1A1A1A] to-black instrument-sans">
      {/* Left Section - Image */}
      <div className="flex-1 flex items-center justify-center lg:justify-end">
        <img 
          src={chatbot_image} 
          alt="AI Assistant" 
          className="w-[400px] sm:w-full lg:h-[850px] lg:w-full overflow-hidden"
        />
      </div>

      {/* Right Section - Login Form */}
      <div className="flex-1 flex items-center justify-center lg:justify-start px-4">
        <div className="w-full max-w-md space-y-6 lg:-translate-x-16 -translate-y-36 sm:-translate-y-56 lg:translate-y-0">
          <div className="space-y-2 lg:space-y-6 text-center lg:text-start">
            <p className="text-white/90 text-lg lg:text-2xl">Hi there!</p>
            <h1 className="text-white text-3xl lg:text-4xl">Let's get started.</h1>
          </div>

          <form className="space-y-4 lg:space-y-6">
            {authFields.map((field: Field) => (
              <Input
                key={field.name}
                name={field.name}
                type={field.type}
                placeholder={field.placeholder}
                required={field.required}
                onChange={handleChange}
              />
            ))}
            <Button 
              label="Sign Up" 
              variant="primary" 
              type="submit" 
            />

            <div className="flex items-center justify-center space-x-4 pt-4">
              <div className="h-[1px] flex-1 bg-gray-700"></div>
              <span className="text-gray-400">or</span>
              <div className="h-[1px] flex-1 bg-gray-700"></div>
            </div>

            <Button 
              label="Login into an existing account" 
              variant="secondary"
              onClick={() => {}} 
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;