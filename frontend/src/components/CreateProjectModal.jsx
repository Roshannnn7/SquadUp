import { useState } from 'react';
import { X, FolderPlus } from 'lucide-react';
import { projectAPI } from '../services/api';
import toast from 'react-hot-toast';

const CreateProjectModal = ({ isOpen, onClose, onProjectCreated }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        tech: '',
        difficulty: 'Beginner',
        githubUrl: '',
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Convert tech string to array
            const techArray = formData.tech.split(',').map((t) => t.trim()).filter(Boolean);

            await projectAPI.create({
                ...formData,
                tech: techArray,
            });

            toast.success('Project created successfully! 🚀');
            onProjectCreated();
            setFormData({
                title: '',
                description: '',
                tech: '',
                difficulty: 'Beginner',
                githubUrl: '',
            });
            onClose();
        } catch (error) {
            console.error('Create project error:', error);
            toast.error(error.response?.data?.message || 'Failed to create project');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="bg-gray-900 rounded-2xl shadow-2xl max-w-2xl w-full border border-white/10 overflow-hidden">
                <div className="gradient-bg p-6 relative">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-1 hover:bg-white/20 rounded transition-colors"
                    >
                        <X className="w-6 h-6 text-white" />
                    </button>
                    <h2 className="text-2xl font-bold text-white mb-2 flex items-center">
                        <FolderPlus className="w-6 h-6 mr-2" />
                        Create New Project
                    </h2>
                    <p className="text-gray-200">
                        Share your idea and find collaborators
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="col-span-1 md:col-span-2">
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Project Title
                            </label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="e.g. AI-Powered Task Manager"
                                required
                            />
                        </div>

                        <div className="col-span-1 md:col-span-2">
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Description
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 h-32 resize-none"
                                placeholder="Describe your project idea..."
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Technologies (comma separated)
                            </label>
                            <input
                                type="text"
                                value={formData.tech}
                                onChange={(e) => setFormData({ ...formData, tech: e.target.value })}
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="React, Node.js, MongoDB"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Difficulty Level
                            </label>
                            <select
                                value={formData.difficulty}
                                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                            >
                                <option value="Beginner">Beginner</option>
                                <option value="Intermediate">Intermediate</option>
                                <option value="Advanced">Advanced</option>
                            </select>
                        </div>

                        <div className="col-span-1 md:col-span-2">
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                GitHub Repository (Optional)
                            </label>
                            <input
                                type="url"
                                value={formData.githubUrl}
                                onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="https://github.com/username/repo"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4 border-t border-gray-700">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 bg-gray-800 border border-gray-700 rounded-lg font-medium text-white hover:bg-gray-700 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2 bg-gradient-to-r from-primary-500 to-accent-500 rounded-lg font-medium text-white hover:shadow-lg hover:shadow-accent-500/50 transition-all disabled:opacity-50"
                        >
                            {loading ? 'Creating...' : 'Create Project'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateProjectModal;
