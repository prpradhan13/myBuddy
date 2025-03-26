import React, { useMemo } from "react";

interface PasswordCheckProps {
  password: string;
  isSubmitted: boolean;
}

const PasswordCheck: React.FC<PasswordCheckProps> = ({
  password,
  isSubmitted,
}) => {
  const checks = useMemo(
    () => ({
      minLength: password.length >= 6,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecialChar: /[@$#!%*?&]/.test(password),
    }),
    [password]
  );

  return (
    <div className="text-sm mt-2">
      <p className="text-gray-400">Password must contain:</p>
      <ul className="list-disc ml-5">
        {Object.entries(checks).map(([key, isValid]) => (
          <li
            key={key}
            className={
              isValid
                ? "text-green-400"
                : isSubmitted
                ? "text-red-400"
                : "text-gray-400"
            }
          >
            {getRequirementText(key)}
          </li>
        ))}
      </ul>
    </div>
  );
};

const getRequirementText = (key: string) => {
  switch (key) {
    case "minLength":
      return "At least 6 characters";
    case "hasUpperCase":
      return "At least one uppercase letter (A-Z)";
    case "hasLowerCase":
      return "At least one lowercase letter (a-z)";
    case "hasNumber":
      return "At least one number (0-9)";
    case "hasSpecialChar":
      return "At least one special character (@, $, #, !, %, *, ?, &)";
    default:
      return "";
  }
};

export default PasswordCheck;
