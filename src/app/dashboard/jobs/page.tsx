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
  const [showForm, setShowForm] = useState(false);
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
      setShowForm(false);
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
      <div className="border-b border-border pb-5 sm:flex sm:items-center sm:justify-between">
        <h2 className="text-2xl font-semibold leading-6 text-dark-grey">Job Applications</h2>
        <div className="mt-3 sm:ml-4 sm:mt-0">
          <button
            type="button"
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
            Add Job
          </button>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4 bg-surface p-4 rounded-lg border border-border">
          <div>
            <label htmlFor="company" className="block text-sm font-medium text-dark-grey">
              Company
            </label>
            <input
              type="text"
              id="company"
              className="mt-1 block w-full rounded-md border-0 py-1.5 text-dark-grey shadow-sm ring-1 ring-inset ring-border placeholder:text-medium-grey focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
              {...register('company', { required: 'Company is required' })}
            />
            {errors.company && (
              <p className="mt-1 text-sm text-error">{errors.company.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="position" className="block text-sm font-medium text-dark-grey">
              Position
            </label>
            <input
              type="text"
              id="position"
              className="mt-1 block w-full rounded-md border-0 py-1.5 text-dark-grey shadow-sm ring-1 ring-inset ring-border placeholder:text-medium-grey focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
              {...register('position', { required: 'Position is required' })}
            />
            {errors.position && (
              <p className="mt-1 text-sm text-error">{errors.position.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-dark-grey">
              Status
            </label>
            <select
              id="status"
              className="mt-1 block w-full rounded-md border-0 py-1.5 text-dark-grey shadow-sm ring-1 ring-inset ring-border focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
              {...register('status', { required: 'Status is required' })}
            >
              <option value="not_applied">Not Applied</option>
              <option value="applied">Applied</option>
              <option value="interviewing">Interviewing</option>
              <option value="offer">Offer</option>
              <option value="rejected">Rejected</option>
            </select>
            {errors.status && (
              <p className="mt-1 text-sm text-error">{errors.status.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-dark-grey">
              Notes
            </label>
            <textarea
              id="notes"
              rows={3}
              className="mt-1 block w-full rounded-md border-0 py-1.5 text-dark-grey shadow-sm ring-1 ring-inset ring-border placeholder:text-medium-grey focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
              {...register('notes')}
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded-md bg-surface px-3 py-2 text-sm font-semibold text-dark-grey shadow-sm ring-1 ring-inset ring-border hover:bg-light-grey"
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
      )}

      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-border">
              <thead>
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-dark-grey sm:pl-0">
                    Company
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-dark-grey">
                    Position
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-dark-grey">
                    Status
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-dark-grey">
                    Date Applied
                  </th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {jobs.map((job) => (
                  <tr key={job.id}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-dark-grey sm:pl-0">
                      {job.company}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-medium-grey">{job.position}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm">
                      <span className={statusColors[job.status]}>{statusLabels[job.status]}</span>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-medium-grey">
                      {new Date(job.date_applied).toLocaleDateString()}
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                      <select
                        value={job.status}
                        onChange={(e) => updateJobStatus(job.id, e.target.value as Job['status'])}
                        className="rounded-md border-0 py-1.5 text-dark-grey shadow-sm ring-1 ring-inset ring-border focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                      >
                        {Object.entries(statusLabels).map(([value, label]) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        ))}
                      </select>
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