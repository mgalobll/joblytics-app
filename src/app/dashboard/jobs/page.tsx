'use client';

import { useState } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { useForm } from 'react-hook-form';
import { supabase } from '@/lib/supabase';
import { Job } from '@/lib/supabase';

type JobFormData = {
  company: string;
  position: string;
  status: 'not_applied' | 'applied' | 'interviewing' | 'offer' | 'rejected';
  notes?: string;
};

const statusColors = {
  not_applied: 'bg-medium-grey/10 text-dark-grey',
  applied: 'bg-info-light text-info',
  interviewing: 'bg-warning-light text-warning',
  offer: 'bg-success-light text-success',
  rejected: 'bg-error-light text-error',
};

const statusLabels = {
  not_applied: 'Not Applied',
  applied: 'Applied',
  interviewing: 'Interviewing',
  offer: 'Offer',
  rejected: 'Rejected',
};

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isAddingJob, setIsAddingJob] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<JobFormData>();

  const onSubmit = async (data: JobFormData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const newJob = {
        ...data,
        date_applied: new Date().toISOString(),
        user_id: user.id,
      };

      const { data: job, error } = await supabase
        .from('jobs')
        .insert([newJob])
        .select()
        .single();

      if (error) throw error;
      setJobs([...jobs, job]);
      setIsAddingJob(false);
      reset();
    } catch (error) {
      console.error('Error creating job:', error);
    }
  };

  const updateJobStatus = async (jobId: string, newStatus: Job['status']) => {
    try {
      const { error } = await supabase
        .from('jobs')
        .update({ status: newStatus })
        .eq('id', jobId);

      if (error) throw error;
      setJobs(jobs.map(job => job.id === jobId ? { ...job, status: newStatus } : job));
    } catch (error) {
      console.error('Error updating job status:', error);
    }
  };

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold leading-6 text-dark-grey">Job Applications</h1>
          <p className="mt-2 text-sm text-medium-grey">
            Track and manage your job applications in one place.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            onClick={() => setIsAddingJob(true)}
            className="inline-flex items-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
            Add Job
          </button>
        </div>
      </div>

      {isAddingJob && (
        <div className="mt-8 flow-root">
          <div className="bg-white px-4 py-5 sm:p-6 rounded-lg shadow">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-dark-grey">
                    Company
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="company"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                      {...register('company', { required: 'Company is required' })}
                    />
                    {errors.company && (
                      <p className="mt-1 text-sm text-error">{errors.company.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="position" className="block text-sm font-medium text-dark-grey">
                    Position
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="position"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                      {...register('position', { required: 'Position is required' })}
                    />
                    {errors.position && (
                      <p className="mt-1 text-sm text-error">{errors.position.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-dark-grey">
                    Status
                  </label>
                  <div className="mt-1">
                    <select
                      id="status"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                      {...register('status', { required: 'Status is required' })}
                    >
                      {Object.entries(statusLabels).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-dark-grey">
                    Notes
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="notes"
                      rows={3}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                      {...register('notes')}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingJob(false);
                    reset();
                  }}
                  className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-dark-grey shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-dark-grey sm:pl-0">
                    Company
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-dark-grey">
                    Position
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-dark-grey">
                    Date Applied
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-dark-grey">
                    Status
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-dark-grey">
                    Notes
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {jobs.map((job) => (
                  <tr key={job.id}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-dark-grey sm:pl-0">
                      {job.company}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-medium-grey">
                      {job.position}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-medium-grey">
                      {new Date(job.date_applied).toLocaleDateString()}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm">
                      <select
                        value={job.status}
                        onChange={(e) => updateJobStatus(job.id, e.target.value as Job['status'])}
                        className={`rounded-md px-2 py-1 text-xs font-medium ${statusColors[job.status]}`}
                      >
                        {Object.entries(statusLabels).map(([value, label]) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-medium-grey">
                      {job.notes}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 