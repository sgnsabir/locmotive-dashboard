import React, { FC, useState } from "react";

interface TwoFactorAuthProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
}

const TwoFactorAuth: FC<TwoFactorAuthProps> = ({ enabled, onToggle }) => {
  const [verificationCode, setVerificationCode] = useState<string>("");
  const [sending, setSending] = useState<boolean>(false);

  const handleSendCode = () => {
    setSending(true);
    setTimeout(() => {
      alert("Verification code sent!");
      setSending(false);
    }, 1000);
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
            className="mt-1 block border rounded p-2 w-full max-w-xs"
          />
        </div>
      )}
    </div>
  );
};

export default TwoFactorAuth;
