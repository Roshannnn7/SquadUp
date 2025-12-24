import { useState, useEffect } from 'react';
import { Folder, Users as UsersIcon, Plus } from 'lucide-react';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';
import CreateProjectModal from '../components/CreateProjectModal';
import { projectAPI } from '../services/api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const ProjectsPage = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [filter, setFilter] = useState('all'); // 'all' or 'my'
    const { currentUser } = useAuth();

    useEffect(() => {
        fetchProjects();
    }, [filter]);

    const fetchProjects = async () => {
        try {
            setLoading(true);
            const params = filter === 'my' ? { member: 'true' } : {};
            const { data } = await projectAPI.getAll(params);
            setProjects(data.data);
        } catch (error) {
            console.error('Error fetching projects:', error);
            toast.error('Failed to load projects');
        } finally {
            setLoading(false);
        }
    };

    const handleJoinProject = async (projectId) => {
        try {
            await projectAPI.join(projectId);
            toast.success('Joined project successfully!');
            fetchProjects(); // Refresh list
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to join project');
        }
    };

    const getDifficultyColor = (difficulty) => {
        switch (difficulty) {
            case 'Beginner':
                return 'from-green-500 to-emerald-500';
            case 'Intermediate':
                return 'from-yellow-500 to-orange-500';
            case 'Advanced':
                return 'from-red-500 to-pink-500';
            default:
                return 'from-blue-500 to-purple-500';
        }
    };

    return (
        <div className="min-h-screen bg-gray-900">
            <Navbar />

            <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-center mb-12">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold mb-4">
                                <span className="gradient-text">Student Projects</span>
                            </h1>
                            <p className="text-xl text-gray-400">
                                Collaborate on real-world projects and build your portfolio
                            </p>
                        </div>
                        {currentUser && (
                            <button
                                onClick={() => setIsCreateModalOpen(true)}
                                className="px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-500 rounded-lg font-bold hover:shadow-lg hover:shadow-accent-500/50 transition-all flex items-center"
                            >
                                <Plus className="w-5 h-5 mr-2" />
                                Create Project
                            </button>
                        )}
                    </div>

                    {/* Filter Buttons */}
                    <div className="flex items-center space-x-4 mb-8">
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-6 py-2 rounded-lg font-semibold transition-all ${filter === 'all'
                                    ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-lg'
                                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                                }`}
                        >
                            All Projects
                        </button>
                        <button
                            onClick={() => setFilter('my')}
                            className={`px-6 py-2 rounded-lg font-semibold transition-all ${filter === 'my'
                                    ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-lg'
                                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                                }`}
                        >
                            My Projects
                        </button>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-20">
                            <LoadingSpinner size="large" />
                        </div>
                    ) : projects.length === 0 ? (
                        <div className="text-center py-20">
                            <Folder className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                            <p className="text-gray-400 text-lg">No projects found. Be the first to create one!</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                            {projects.map((project) => (
                                <div
                                    key={project._id}
                                    className="glass-effect rounded-xl p-6 card-hover border border-white/10 group relative overflow-hidden h-[250px] flex flex-col justify-center"
                                >
                                    <div className="relative z-10">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center shadow-lg">
                                                    <Folder className="w-6 h-6 text-white" />
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-bold text-white tracking-tight">
                                                        {project.title}
                                                    </h3>
                                                    <div className="flex items-center space-x-2 mt-1">
                                                        <div
                                                            className={`px-2 py-0.5 bg-gradient-to-r ${getDifficultyColor(
                                                                project.difficulty
                                                            )} rounded text-[10px] font-bold uppercase tracking-wider text-white shadow-sm`}
                                                        >
                                                            {project.difficulty}
                                                        </div>
                                                        <div className="flex items-center text-gray-400 text-xs">
                                                            <UsersIcon className="w-3 h-3 mr-1" />
                                                            <span>{project.members?.length || 1} joined</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Hover Content - Description & Join */}
                                        <div className="absolute inset-0 bg-gray-900/95 flex flex-col justify-center items-center p-6 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl">
                                            <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                                                {project.description}
                                            </p>

                                            <div className="flex flex-wrap gap-2 justify-center mb-6">
                                                {project.tech?.slice(0, 3).map((tech) => (
                                                    <span
                                                        key={tech}
                                                        className="px-2 py-1 bg-white/10 text-primary-300 rounded text-xs border border-white/5"
                                                    >
                                                        {tech}
                                                    </span>
                                                ))}
                                                {project.tech?.length > 3 && (
                                                    <span className="px-2 py-1 text-gray-400 text-xs">
                                                        +{project.tech.length - 3}
                                                    </span>
                                                )}
                                            </div>

                                            <button
                                                onClick={() => handleJoinProject(project._id)}
                                                className="px-6 py-2 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full font-bold text-white hover:shadow-lg hover:shadow-accent-500/50 transition-transform hover:scale-105 active:scale-95"
                                            >
                                                Join Project
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <CreateProjectModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onProjectCreated={fetchProjects}
            />
        </div >
    );
};

export default ProjectsPage;
