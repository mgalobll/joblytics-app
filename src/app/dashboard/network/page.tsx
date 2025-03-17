'use client';

import { useState } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { useForm } from 'react-hook-form';
import { supabase } from '@/lib/supabase';
import { Connection } from '@/lib/supabase';

type ConnectionFormData = {
  name: string;
  company: string;
  position: string;
  reach_out_status: 'not_contacted' | 'contacted' | 'responded' | 'meeting_scheduled' | 'met';
  profile_link?: string;
  priority: number;
  notes?: string;
};

const statusColors = {
  not_contacted: 'bg-medium-grey/10 text-dark-grey',
  contacted: 'bg-info-light text-info',
  responded: 'bg-warning-light text-warning',
  meeting_scheduled: 'bg-success-light text-success',
  met: 'bg-success text-white',
};

const statusLabels = {
  not_contacted: 'Not Contacted',
  contacted: 'Contacted',
  responded: 'Responded',
  meeting_scheduled: 'Meeting Scheduled',
  met: 'Met',
};

export default function NetworkPage() {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [isAddingConnection, setIsAddingConnection] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ConnectionFormData>();

  const onSubmit = async (data: ConnectionFormData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const newConnection = {
        ...data,
        created_at: new Date().toISOString(),
        user_id: user.id,
      };

      const { data: connection, error } = await supabase
        .from('connections')
        .insert([newConnection])
        .select()
        .single();

      if (error) throw error;
      setConnections([...connections, connection]);
      setIsAddingConnection(false);
      reset();
    } catch (error) {
      console.error('Error creating connection:', error);
    }
  };

  const updateConnectionStatus = async (connectionId: string, newStatus: Connection['reach_out_status']) => {
    try {
      const { error } = await supabase
        .from('connections')
        .update({ reach_out_status: newStatus })
        .eq('id', connectionId);

      if (error) throw error;
      setConnections(connections.map(conn => 
        conn.id === connectionId ? { ...conn, reach_out_status: newStatus } : conn
      ));
    } catch (error) {
      console.error('Error updating connection status:', error);
    }
  };

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold leading-6 text-dark-grey">Network</h1>
          <p className="mt-2 text-sm text-medium-grey">
            Manage your professional connections and track networking activities.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            onClick={() => setIsAddingConnection(true)}
            className="inline-flex items-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
            Add Connection
          </button>
        </div>
      </div>

      {isAddingConnection && (
        <div className="mt-8 flow-root">
          <div className="bg-white px-4 py-5 sm:p-6 rounded-lg shadow">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-dark-grey">
                    Name
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="name"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                      {...register('name', { required: 'Name is required' })}
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-error">{errors.name.message}</p>
                    )}
                  </div>
                </div>

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
                  <label htmlFor="profile_link" className="block text-sm font-medium text-dark-grey">
                    Profile Link
                  </label>
                  <div className="mt-1">
                    <input
                      type="url"
                      id="profile_link"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                      {...register('profile_link')}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="priority" className="block text-sm font-medium text-dark-grey">
                    Priority (1-5)
                  </label>
                  <div className="mt-1">
                    <input
                      type="number"
                      id="priority"
                      min="1"
                      max="5"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                      {...register('priority', {
                        required: 'Priority is required',
                        min: { value: 1, message: 'Minimum priority is 1' },
                        max: { value: 5, message: 'Maximum priority is 5' },
                      })}
                    />
                    {errors.priority && (
                      <p className="mt-1 text-sm text-error">{errors.priority.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="reach_out_status" className="block text-sm font-medium text-dark-grey">
                    Status
                  </label>
                  <div className="mt-1">
                    <select
                      id="reach_out_status"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                      {...register('reach_out_status', { required: 'Status is required' })}
                    >
                      {Object.entries(statusLabels).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="sm:col-span-2">
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
                    setIsAddingConnection(false);
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
                    Name
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-dark-grey">
                    Company
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-dark-grey">
                    Position
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-dark-grey">
                    Priority
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-dark-grey">
                    Status
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-dark-grey">
                    Profile
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-dark-grey">
                    Notes
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {connections.map((connection) => (
                  <tr key={connection.id}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-dark-grey sm:pl-0">
                      {connection.name}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-medium-grey">
                      {connection.company}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-medium-grey">
                      {connection.position}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-medium-grey">
                      {connection.priority}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm">
                      <select
                        value={connection.reach_out_status}
                        onChange={(e) => updateConnectionStatus(connection.id, e.target.value as Connection['reach_out_status'])}
                        className={`rounded-md px-2 py-1 text-xs font-medium ${statusColors[connection.reach_out_status]}`}
                      >
                        {Object.entries(statusLabels).map(([value, label]) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm">
                      {connection.profile_link && (
                        <a
                          href={connection.profile_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:text-primary-dark"
                        >
                          View Profile
                        </a>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-medium-grey">
                      {connection.notes}
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