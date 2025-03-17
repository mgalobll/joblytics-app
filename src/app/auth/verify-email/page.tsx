import Link from 'next/link';
import { EnvelopeIcon } from '@heroicons/react/24/outline';

export default function VerifyEmailPage() {
  return (
    <div className="text-center">
      <EnvelopeIcon className="mx-auto h-12 w-12 text-primary" />
      <h2 className="mt-2 text-lg font-medium text-gray-900">
        Check your email
      </h2>
      <p className="mt-1 text-sm text-gray-500">
        We&apos;ve sent you a verification link. Please check your email to verify your account.
      </p>
      <div className="mt-6">
        <Link
          href="/auth/login"
          className="text-sm font-medium text-primary hover:text-primary-dark"
        >
          Return to login
        </Link>
      </div>
    </div>
  );
} 