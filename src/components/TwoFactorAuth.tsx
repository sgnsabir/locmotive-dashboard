import React, { FC, useState } from "react";
import { getToken } from "@/api/apiHelper";

interface TwoFactorAuthProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
}

const TwoFactorAuth: FC<TwoFactorAuthProps> = ({ enabled, onToggle }) => {
  const [verificationCode, setVerificationCode] = useState<string>("");
  const [sending, setSending] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  const handleSendCode = async () => {
    setSending(true);
    setErrorMessage("");
    setSuccessMessage("");
    try {
      const token = getToken();
      const response = await fetch("/api/auth/send-verification-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: "include",
      });
      if (!response.ok) {
        if (response.status === 429) {
          // Optionally, implement retry logic here.
        }
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to send verification code"
        );
      }
      const data = await response.json();
      setSuccessMessage(data.message || "Verification code sent successfully.");
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("An error occurred while sending the code.");
      }
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="mt-4">
      <h2 className="text-lg font-semibold">Two-Factor Authentication</h2>
      <div className="flex items-center space-x-4">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => onToggle(e.target.checked)}
            className="form-checkbox"
          />
          <span>Enable 2FA</span>
        </label>
        {enabled && (
          <button
            onClick={handleSendCode}
            disabled={sending}
            className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700"
          >
            {sending ? "Sending..." : "Send Verification Code"}
          </button>
        )}
      </div>
      {enabled && (
        <div className="mt-2">
          <label className="block text-sm font-medium text-gray-700">
            Enter Verification Code
          </label>
          <input
            type="text"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            className="mt-1 block w-full max-w-xs border rounded p-2"
          />
        </div>
      )}
      {successMessage && (
        <p className="mt-2 text-green-600 text-sm">{successMessage}</p>
      )}
      {errorMessage && (
        <p className="mt-2 text-red-600 text-sm">{errorMessage}</p>
      )}
    </div>
  );
};

export default TwoFactorAuth;
