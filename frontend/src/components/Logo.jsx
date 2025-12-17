import { Link } from 'react-router-dom';

const Logo = ({ className = "w-10 h-10", textSize = "text-2xl" }) => {
    return (
        <div className="flex items-center gap-3">
            <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={className}
            >
                <path
                    d="M12 2L2 7L12 12L22 7L12 2Z"
                    stroke="#A855F7"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path
                    d="M2 17L12 22L22 17"
                    stroke="#A855F7"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path
                    d="M2 12L12 17L22 12"
                    stroke="#A855F7"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
            <span className={`font-bold text-white tracking-tight ${textSize}`}>
                SquadUp
            </span>
        </div>
    );
};

export default Logo;
