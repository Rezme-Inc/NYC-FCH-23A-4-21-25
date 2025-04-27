import React, { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { Modal } from './ui-kit/Modal';
import { Input } from './ui-kit/Input';
import { Button } from './ui-kit/Button';
import { CheckCircle, Loader, Database, Mail, RefreshCw } from 'lucide-react';
import { Logo } from './Logo';

const WORKDAY_URL = 'https://marketplace.workday.com/en-US/pages/partner-profile?vendor=6f0bc3ee-3c5e-4241-8861-104cabc8278f';
const NEWSLETTER_URL = 'https://rezme.beehiiv.com/subscribe';

interface FormData {
  recipientEmail: string;
}

interface SendAssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  handlePreview: (data: { recipientEmail: string }) => void;
  onReset: () => void;
}

const ThankYouMessage: React.FC<{ onClose: () => void; onReset: () => void }> = React.memo(({ onClose, onReset }) => (
  <div className="flex flex-col items-center py-12 px-8 text-center">
    <Logo className="mb-8" />
    <CheckCircle className="w-12 h-12 text-green-500 mb-5" />

    <h2 className="text-3xl font-semibold mb-4">Thank You!</h2>

    <p className="text-base leading-relaxed max-w-xl mb-6">
      Thank you for completing the individualized assessment and sharing in
      the creation of technology to strengthen communities and increase
      labor‑market participation.
    </p>

    <div className="w-full max-w-md space-y-4 mt-8">
      <a
        href={WORKDAY_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-medium
                 shadow hover:bg-blue-700 focus:outline-none focus:ring transition-colors"
      >
        <Database className="w-5 h-5 mr-2" />
        View our Workday Solution
      </a>

      <a
        href={NEWSLETTER_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center w-full px-6 py-3 bg-green-600 text-white rounded-lg font-medium
                 shadow hover:bg-green-700 focus:outline-none focus:ring transition-colors"
      >
        <Mail className="w-5 h-5 mr-2" />
        Sign up for Newsletter
      </a>

      <button
        onClick={() => {
          onClose();
          onReset();
        }}
        className="flex items-center justify-center w-full px-6 py-3 bg-gray-600 text-white rounded-lg font-medium
                 shadow hover:bg-gray-700 focus:outline-none focus:ring transition-colors"
      >
        <RefreshCw className="w-5 h-5 mr-2" />
        Restart Demo
      </button>
    </div>
  </div>
));

ThankYouMessage.displayName = 'ThankYouMessage';

export const SendAssessmentModal: React.FC<SendAssessmentModalProps> = ({
  isOpen,
  onClose,
  handlePreview,
  onReset,
}) => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isValid }
  } = useForm<FormData>({
    mode: 'onChange'
  });

  const handleClose = useCallback(() => {
    setIsSuccess(false);
    setError(null);
    onClose();
  }, [onClose]);

  const onSubmit = useCallback(async (data: FormData) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      await handlePreview(data);
      setIsSuccess(true);
      reset();
    } catch (error) {
      setError('Failed to send assessment. Please try again.');
      console.error('Failed to send assessment:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [handlePreview, reset]);

  // Reset states when modal is opened
  React.useEffect(() => {
    if (isOpen) {
      setIsSuccess(false);
      setError(null);
      reset();
    }
  }, [isOpen, reset]);

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={isSuccess ? "" : "Send Assessment Results"}>
      {!isSuccess ? (
        <form onSubmit={handleSubmit(onSubmit)} className="p-6">
          <Logo className="mb-6" />
          <div className="space-y-4">
            <div className="mb-6">
              <p className="text-gray-700 mb-4">
                Please share the results of your completed individualized fair‑chance hiring assessment with your team of collaborators so everyone can review the findings and coordinate next steps.
              </p>
              <Input
                label="Recipient Email"
                type="email"
                {...register('recipientEmail')}
                placeholder="Enter recipient's email address"
                disabled={isSubmitting}
              />
              {error && (
                <p className="mt-2 text-sm text-red-600">{error}</p>
              )}
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <Button
              variant="secondary"
              onClick={handleClose}
              className="px-4 py-2"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="px-4 py-2 min-w-[80px]"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader className="w-5 h-5 animate-spin" />
              ) : (
                'Send'
              )}
            </Button>
          </div>
        </form>
      ) : (
        <ThankYouMessage onClose={handleClose} onReset={onReset} />
      )}
    </Modal>
  );
}; 