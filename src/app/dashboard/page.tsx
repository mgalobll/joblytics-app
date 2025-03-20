'use client';

import { useState } from 'react';
import { PlusIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { useForm } from 'react-hook-form';
import { supabase } from '@/lib/supabase';
import { DailyGoal } from '@/lib/supabase';

type GoalFormData = {
  title: string;
  type: 'job_applications' | 'networking' | 'other';
  target_count: number;
};

export default function DailyAgendaPage() {
  const [goals, setGoals] = useState<DailyGoal[]>([]);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<GoalFormData>();

  const onSubmit = async (data: GoalFormData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const newGoal = {
        title: data.title,
        type: data.type,
        target_count: data.target_count,
        current_count: 0,
        date: new Date().toISOString().split('T')[0],
        completed: false,
        user_id: user.id,
      };

      const { data: goal, error } = await supabase
        .from('daily_goals')
        .insert([newGoal])
        .select()
        .single();

      if (error) throw error;
      setGoals([...goals, goal]);
      reset();
    } catch (error) {
      console.error('Error creating goal:', error);
    }
  };

  const toggleGoalCompletion = async (goal: DailyGoal) => {
    try {
      const { error } = await supabase
        .from('daily_goals')
        .update({ completed: !goal.completed })
        .eq('id', goal.id);

      if (error) throw error;
      setGoals(goals.map(g => g.id === goal.id ? { ...g, completed: !g.completed } : g));
    } catch (error) {
      console.error('Error updating goal:', error);
    }
  };

  return (
    <div>
      <div className="border-b border-border pb-5 sm:flex sm:items-center sm:justify-between">
        <h2 className="text-2xl font-semibold leading-6 text-dark-grey">Daily Agenda</h2>
        <div className="mt-3 sm:ml-4 sm:mt-0">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col sm:flex-row gap-3">
            <div>
              <input
                type="text"
                placeholder="Add a new goal"
                className="block w-full rounded-md border-0 py-1.5 text-dark-grey shadow-sm ring-1 ring-inset ring-border placeholder:text-medium-grey focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                {...register('title', { required: 'Title is required' })}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-error">{errors.title.message}</p>
              )}
            </div>

            <div>
              <select
                className="block w-full rounded-md border-0 py-1.5 text-dark-grey shadow-sm ring-1 ring-inset ring-border focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                {...register('type', { required: 'Type is required' })}
              >
                <option value="job_applications">Job Applications</option>
                <option value="networking">Networking</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <input
                type="number"
                placeholder="Target count"
                className="block w-full rounded-md border-0 py-1.5 text-dark-grey shadow-sm ring-1 ring-inset ring-border placeholder:text-medium-grey focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                {...register('target_count', {
                  required: 'Target count is required',
                  min: { value: 1, message: 'Must be at least 1' },
                })}
              />
              {errors.target_count && (
                <p className="mt-1 text-sm text-error">{errors.target_count.message}</p>
              )}
            </div>

            <button
              type="submit"
              className="inline-flex items-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
              Add Goal
            </button>
          </form>
        </div>
      </div>

      <ul role="list" className="mt-6 divide-y divide-border">
        {goals.map((goal) => (
          <li key={goal.id} className="flex items-center justify-between gap-x-6 py-5">
            <div className="flex min-w-0 gap-x-4">
              <div className="min-w-0 flex-auto">
                <p className="text-sm font-semibold leading-6 text-dark-grey">{goal.title}</p>
                <p className="mt-1 truncate text-xs leading-5 text-medium-grey">
                  Progress: {goal.current_count} / {goal.target_count}
                </p>
              </div>
            </div>
            <div className="flex flex-none items-center gap-x-4">
              <button
                onClick={() => toggleGoalCompletion(goal)}
                className={`rounded-full p-1 ${
                  goal.completed
                    ? 'text-success bg-success-light'
                    : 'text-medium-grey hover:text-primary'
                }`}
              >
                <CheckCircleIcon className="h-6 w-6" />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
} 