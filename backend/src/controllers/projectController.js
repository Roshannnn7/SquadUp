import Project from '../models/Project.js';

/**
 * Get all projects
 * @route GET /api/projects
 */
export const getAllProjects = async (req, res) => {
    try {
        const projects = await Project.find()
            .populate('owner', 'displayName photoURL')
            .populate('members', 'displayName photoURL')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: projects.length,
            data: projects,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/**
 * Create new project
 * @route POST /api/projects
 */
export const createProject = async (req, res) => {
    try {
        const { title, description, tech, difficulty, githubUrl } = req.body;

        // Add user as owner and first member
        const project = await Project.create({
            title,
            description,
            tech,
            difficulty,
            githubUrl,
            owner: req.user._id,
            members: [req.user._id],
        });

        const populatedProject = await Project.findById(project._id)
            .populate('owner', 'displayName photoURL')
            .populate('members', 'displayName photoURL');

        res.status(201).json({
            success: true,
            message: 'Project created successfully',
            data: populatedProject,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/**
 * Join a project
 * @route PUT /api/projects/:id/join
 */
export const joinProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found',
            });
        }

        // Check if already a member
        if (project.members.includes(req.user._id)) {
            return res.status(400).json({
                success: false,
                message: 'You are already a member of this project',
            });
        }

        project.members.push(req.user._id);
        await project.save();

        const updatedProject = await Project.findById(project._id)
            .populate('owner', 'displayName photoURL')
            .populate('members', 'displayName photoURL');

        res.json({
            success: true,
            message: 'Joined project successfully',
            data: updatedProject,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
