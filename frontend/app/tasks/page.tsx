'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import Navbar from '@/components/Navbar';
import { Plus, Trash2, Edit2, Loader2, CheckCircle2, Circle, CheckSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Task {
    id: string;
    title: string;
    description: string | null;
    status: 'TODO' | 'IN_PROGRESS' | 'DONE';
    user: {
        email: string;
    };
}

export default function TasksPage() {
    const { user } = useAuth();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
    });

    const fetchTasks = async () => {
        try {
            const response = await api.get('/tasks');
            setTasks(response.data.data);
        } catch (err: unknown) {
            console.error('Failed to fetch tasks', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingTask) {
                await api.patch(`/tasks/${editingTask.id}`, formData);
            } else {
                await api.post('/tasks', formData);
            }
            setIsModalOpen(false);
            setEditingTask(null);
            setFormData({ title: '', description: '' });
            fetchTasks();
        } catch (err: unknown) {
            console.error('Failed to save task', err);
        }
    };

    const toggleStatus = async (task: { id: string; status: string }) => {
        const nextStatus = {
            'TODO': 'IN_PROGRESS',
            'IN_PROGRESS': 'DONE',
            'DONE': 'TODO'
        };
        try {
            await api.patch(`/tasks/${task.id}`, {
                status: nextStatus[task.status as keyof typeof nextStatus]
            });
            fetchTasks();
        } catch (err: unknown) {
            console.error('Failed to update status', err);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this task?')) return;
        try {
            await api.delete(`/tasks/${id}`);
            fetchTasks();
        } catch (err: unknown) {
            console.error('Failed to delete task', err);
            alert('Only Admins can delete tasks.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Task Board</h1>
                        <p className="mt-1 text-sm text-gray-500">Manage and track your organization&apos;s tasks.</p>
                    </div>
                    <button
                        onClick={() => {
                            setEditingTask(null);
                            setFormData({ title: '', description: '' });
                            setIsModalOpen(true);
                        }}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        New Task
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="animate-spin h-8 w-8 text-indigo-600" />
                    </div>
                ) : tasks.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg shadow border border-dashed border-gray-300">
                        <CheckSquare className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No tasks</h3>
                        <p className="mt-1 text-sm text-gray-500">Get started by creating a new task.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {tasks.map((task: Task) => (
                            <div key={task.id} className="bg-white rounded-lg shadow border border-gray-100 p-5 hover:shadow-md transition-shadow relative group">
                                <div className="flex justify-between items-start mb-4">
                                    <button
                                        onClick={() => toggleStatus(task)}
                                        className={cn(
                                            "p-1 rounded-full",
                                            task.status === 'DONE' ? "text-emerald-500" : "text-gray-400 hover:text-indigo-500"
                                        )}
                                    >
                                        {task.status === 'DONE' ? <CheckCircle2 className="h-6 w-6" /> : <Circle className="h-6 w-6" />}
                                    </button>
                                    <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => {
                                                setEditingTask(task);
                                                setFormData({ title: task.title, description: task.description || '' });
                                                setIsModalOpen(true);
                                            }}
                                            className="p-1 text-gray-400 hover:text-indigo-600"
                                        >
                                            <Edit2 className="h-4 w-4" />
                                        </button>
                                        {user?.role === 'ADMIN' && (
                                            <button
                                                onClick={() => handleDelete(task.id)}
                                                className="p-1 text-gray-400 hover:text-red-600"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <h3 className={cn("text-lg font-semibold text-gray-900 mb-1", task.status === 'DONE' && "line-through text-gray-400")}>
                                    {task.title}
                                </h3>
                                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                    {task.description || 'No description provided.'}
                                </p>
                                <div className="flex items-center justify-between pt-4 border-t border-gray-50 text-xs text-gray-400">
                                    <span className={cn(
                                        "px-2 py-1 rounded-full font-medium",
                                        task.status === 'DONE' ? "bg-emerald-50 text-emerald-600" :
                                            task.status === 'IN_PROGRESS' ? "bg-amber-50 text-amber-600" : "bg-gray-100 text-gray-600"
                                    )}>
                                        {task.status.replace('_', ' ')}
                                    </span>
                                    <span>By: {task.user.email.split('@')[0]}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
                        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">
                                {editingTask ? 'Edit Task' : 'Create New Task'}
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                    <textarea
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>
                                <div className="flex justify-end space-x-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
                                    >
                                        {editingTask ? 'Save Changes' : 'Create Task'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

