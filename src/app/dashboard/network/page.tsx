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
      <div className="border-b border-border pb-5 sm:flex sm:items-center sm:justify-between">
        <h2 className="text-2xl font-semibold leading-6 text-dark-grey">Network</h2>
        <div className="mt-3 sm:ml-4 sm:mt-0">
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
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4 bg-surface p-4 rounded-lg border border-border">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-dark-grey">
              Name
            </label>
            <input
              type="text"
              id="name"
              className="mt-1 block w-full rounded-md border-0 py-1.5 text-dark-grey shadow-sm ring-1 ring-inset ring-border placeholder:text-medium-grey focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
              {...register('name', { required: 'Name is required' })}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-error">{errors.name.message}</p>
            )}
          </div>

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
            <label htmlFor="reach_out_status" className="block text-sm font-medium text-dark-grey">
              Status
            </label>
            <select
              id="reach_out_status"
              className="mt-1 block w-full rounded-md border-0 py-1.5 text-dark-grey shadow-sm ring-1 ring-inset ring-border focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
              {...register('reach_out_status', { required: 'Status is required' })}
            >
              <option value="not_contacted">Not Contacted</option>
              <option value="contacted">Contacted</option>
              <option value="responded">Responded</option>
              <option value="meeting_scheduled">Meeting Scheduled</option>
              <option value="met">Met</option>
            </select>
            {errors.reach_out_status && (
              <p className="mt-1 text-sm text-error">{errors.reach_out_status.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="profile_link" className="block text-sm font-medium text-dark-grey">
              Profile Link
            </label>
            <input
              type="url"
              id="profile_link"
              className="mt-1 block w-full rounded-md border-0 py-1.5 text-dark-grey shadow-sm ring-1 ring-inset ring-border placeholder:text-medium-grey focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
              {...register('profile_link')}
            />
          </div>

          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-dark-grey">
              Priority (1-5)
            </label>
            <input
              type="number"
              id="priority"
              min="1"
              max="5"
              className="mt-1 block w-full rounded-md border-0 py-1.5 text-dark-grey shadow-sm ring-1 ring-inset ring-border placeholder:text-medium-grey focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
              {...register('priority', {
                required: 'Priority is required',
                min: { value: 1, message: 'Must be at least 1' },
                max: { value: 5, message: 'Must be at most 5' },
              })}
            />
            {errors.priority && (
              <p className="mt-1 text-sm text-error">{errors.priority.message}</p>
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
              onClick={() => {
                setIsAddingConnection(false);
                reset();
              }}
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
                    Name
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-dark-grey">
                    Company
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-dark-grey">
                    Position
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-dark-grey">
                    Status
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-dark-grey">
                    Priority
                  </th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {connections.map((connection) => (
                  <tr key={connection.id}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-dark-grey sm:pl-0">
                      {connection.name}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-medium-grey">{connection.company}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-medium-grey">{connection.position}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm">
                      <span className={statusColors[connection.reach_out_status]}>
                        {statusLabels[connection.reach_out_status]}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-medium-grey">{connection.priority}</td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                      <select
                        value={connection.reach_out_status}
                        onChange={(e) => updateConnectionStatus(connection.id, e.target.value as Connection['reach_out_status'])}
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