import React, { useState } from 'react';
import { Fingerprint } from 'lucide-react';
import { verifyBiometrics } from '../services/webAuthnService';

interface BiometricModalProps {
  isOpen: boolean;
  onSuccess: () => void;
}

export const BiometricModal: React.FC<BiometricModalProps> = ({ isOpen, onSuccess }) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleTriggerAuth = async () => {
    setIsVerifying(true);
    setErrorMsg(null);
    try {
      const res = await verifyBiometrics();
      if (res.success) {
        onSuccess();
      } else {
        setErrorMsg('Verification failed. Please try again.');
      }
    } catch {
      setErrorMsg('Verification error.');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4">
      <div className="max-w-sm w-full bg-neutral-900 border border-neutral-800 rounded-xl p-6 flex flex-col items-center text-center gap-4 text-neutral-200">
        <div
          onClick={handleTriggerAuth}
          className="w-16 h-16 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center cursor-pointer hover:border-neutral-500 transition-colors"
        >
          <Fingerprint className="w-8 h-8 text-neutral-300" />
        </div>

        <div>
          <h3 className="text-sm font-semibold text-white">Biometric Unlock</h3>
          <p className="text-xs text-neutral-400 mt-1">
            Verify identity using TouchID, FaceID, or device passkey to unlock.
          </p>
        </div>

        {errorMsg && <p className="text-xs text-rose-400 font-mono">{errorMsg}</p>}

        <button
          onClick={handleTriggerAuth}
          disabled={isVerifying}
          className="w-full py-2 px-3 rounded bg-white hover:bg-neutral-100 disabled:opacity-50 text-neutral-950 font-medium text-xs transition-colors"
        >
          {isVerifying ? 'Verifying...' : 'Verify Identity'}
        </button>
      </div>
    </div>
  );
};
