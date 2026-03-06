'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import Navbar from '@/components/Navbar';
import { CheckCircle2, Clock, ListTodo, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
    const { user, isLoading } = useAuth();
    const [stats, setStats] = useState({
        totalTasks: 0,
        todoTasks: 0,
        inProgressTasks: 0,
        doneTasks: 0,
        orgUsers: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        const fetchStats = async () => {
            try {
                const [tasksRes, orgRes] = await Promise.all([
                    api.get('/tasks'),
                    api.get('/org'),
                ]);

                const tasks = tasksRes.data.data;
                const org = orgRes.data.data;

                setStats({
                    totalTasks: tasks.length,
                    todoTasks: tasks.filter((t: { status: string }) => t.status === 'TODO').length,
                    inProgressTasks: tasks.filter((t: { status: string }) => t.status === 'IN_PROGRESS').length,
                    doneTasks: tasks.filter((t: { status: string }) => t.status === 'DONE').length,
                    orgUsers: org._count.users,
                });
            } catch (err) {
                console.error('Failed to fetch dashboard stats', err);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [user]);

    if (isLoading || loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    const cards = [
        { name: 'Total Tasks', value: stats.totalTasks, icon: ListTodo, color: 'text-blue-600', bg: 'bg-blue-50' },
        { name: 'In Progress', value: stats.inProgressTasks, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
        { name: 'Completed', value: stats.doneTasks, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { name: 'Team Members', value: stats.orgUsers, icon: TrendingUp, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.email.split('@')[0]}!</h1>
                    <p className="mt-1 text-sm text-gray-500">Here is what is happening in your organization today.</p>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {cards.map((card) => (
                        <div key={card.name} className="bg-white overflow-hidden shadow rounded-lg border border-gray-100">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className={cn("flex-shrink-0 p-3 rounded-md", card.bg)}>
                                        <card.icon className={cn("h-6 w-6", card.color)} aria-hidden="true" />
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">{card.name}</dt>
                                            <dd className="text-2xl font-semibold text-gray-900">{card.value}</dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-5 py-3">
                                <div className="text-sm">
                                    <Link href={card.name === 'Team Members' ? '/users' : '/tasks'} className="font-medium text-indigo-600 hover:text-indigo-500">
                                        View all
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-8 bg-white shadow rounded-lg border border-gray-100 p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
                    <div className="flex flex-wrap gap-4">
                        <Link
                            href="/tasks"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            <CheckSquare className="mr-2 h-4 w-4" />
                            Manage Tasks
                        </Link>
                        {user?.role === 'ADMIN' && (
                            <Link
                                href="/users"
                                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                <Users className="mr-2 h-4 w-4" />
                                Manage Team
                            </Link>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}

// I need to import cn and CheckSquare
import { cn } from '@/lib/utils';
import { CheckSquare, Users } from 'lucide-react';
