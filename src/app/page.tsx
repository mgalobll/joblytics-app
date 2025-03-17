import Link from 'next/link';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

export default function Home() {
  return (
    <div className="relative isolate overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.primary-light),theme(colors.light-grey))] opacity-20" />
      
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h1 className="text-4xl font-bold tracking-tight text-dark-grey sm:text-6xl">
            Organize Your Job Search Journey
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Joblytics helps you centralize your job applications, track networking connections, and achieve your daily goals. Take control of your job search process with our comprehensive tracking system.
          </p>
          <div className="mt-10 flex items-center gap-x-6">
            <Link
              href="/auth/signup"
              className="rounded-md bg-primary px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-dark transition-colors duration-200 flex items-center gap-2"
            >
              Get started
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
            <Link
              href="/auth/login"
              className="text-sm font-semibold leading-6 text-gray-900"
            >
              Log in <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="mx-auto mt-32 max-w-7xl sm:mt-40">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-primary">Streamline Your Process</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-dark-grey sm:text-4xl">
              Everything you need to manage your job search
            </p>
          </div>

          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              {features.map((feature) => (
                <div key={feature.name} className="flex flex-col">
                  <dt className="text-lg font-semibold leading-7 text-dark-grey">
                    {feature.name}
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                    <p className="flex-auto">{feature.description}</p>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}

const features = [
  {
    name: 'Application Tracking',
    description: 'Keep track of all your job applications in one place. Monitor status updates and important dates.',
  },
  {
    name: 'Network Management',
    description: 'Build and maintain your professional network. Track connections and follow up with potential opportunities.',
  },
  {
    name: 'Daily Goals',
    description: 'Set and achieve daily objectives. Stay motivated and organized throughout your job search journey.',
  },
];
