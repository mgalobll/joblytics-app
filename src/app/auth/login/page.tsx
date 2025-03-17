import Link from 'next/link';
import { LoginForm } from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <>
      <LoginForm />
      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">
              New to Joblytics?
            </span>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/auth/signup"
            className="font-medium text-primary hover:text-primary-dark"
          >
            Create an account
          </Link>
        </div>
      </div>
    </>
  );
} 