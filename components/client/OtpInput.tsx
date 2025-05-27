import React, {
  useState,
  useRef,
  ClipboardEvent,
  ChangeEvent,
  KeyboardEvent,
} from "react";
import clsx from "clsx";

interface OtpInputProps {
    className?: string;
  length?: number;
  onChange?: (otp: string) => void;
}

const OtpInput: React.FC<OtpInputProps> = ({ className, length = 6, onChange }) => {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(""));
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const { value } = e.target;
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    onChange?.(newOtp.join(""));

    if (value && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const newOtp = [...otp];
      newOtp[index - 1] = "";
      setOtp(newOtp);
      inputsRef.current[index - 1]?.focus();
      onChange?.(newOtp.join(""));
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLDivElement>) => {
    const pastedData = e.clipboardData.getData("Text").slice(0, length);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = Array(length).fill("");
    [...pastedData].forEach((char, i) => {
      newOtp[i] = char;
    });
    setOtp(newOtp);
    onChange?.(newOtp.join(""));

    const nextEmpty = newOtp.findIndex((char) => !char);
    if (nextEmpty !== -1) inputsRef.current[nextEmpty]?.focus();
  };

  return (
    <div className={clsx("flex gap-2 justify-center", className)} onPaste={handlePaste}>
      {otp.map((digit, index) => (
        <input
          key={index}
          ref={(el) => {
            inputsRef.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          className={clsx(
            "w-10 h-10 text-center text-lg border rounded outline-none transition",
            digit ? "border-success" : "border-base-content/30",
            "focus:border-info"
          )}
        />
      ))}
    </div>
  );
};

export default OtpInput;
