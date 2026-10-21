import { ButtonHTMLAttributes, ReactNode } from "react";

export interface PropTypes extends ButtonHTMLAttributes<HTMLButtonElement> {
    label?: string;
    id?: string;
    name?: string;
    clasName?: string;
    className?: string;
    children: ReactNode;
    type?: 'submit' | 'button' | 'reset';
    color?: 'primer' | 'sekunder';
    error?: string;
}

const Button = (props: PropTypes) => {
    const {
        label,
        id,
        clasName = '',
        className = '',
        name,
        children,
        type = 'submit',
        color = 'primer',
        error,
        disabled,
        ...rest
    } = props;

    const extraClass = clasName || className;

    const colorStyle = {
        primer: 'bg-[#3A86FF] text-white shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 border border-transparent',
        sekunder: 'bg-transparent border border-[#3A86FF] text-[#3A86FF] hover:bg-[#3A86FF]/10',
    };

    const buttonElement = (
        <button
            id={id}
            name={name}
            type={type}
            disabled={disabled}
            className={`${colorStyle[color]} ${extraClass} py-3 px-5 rounded-xl font-semibold text-sm transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 active:translate-y-0 disabled:transform-none flex items-center justify-center gap-2`}
            {...rest}
        >
            {children}
        </button>
    );

    if (label) {
        return (
            <label htmlFor={id} className="flex flex-col gap-1 w-full">
                <span className="text-xs font-bold text-slate-700">{label}</span>
                {buttonElement}
                {error && <span className="text-rose-500 text-xs mt-0.5">{error}</span>}
            </label>
        );
    }

    return (
        <div className="w-full">
            {buttonElement}
            {error && <span className="text-rose-500 text-xs mt-0.5">{error}</span>}
        </div>
    );
};

export default Button;
