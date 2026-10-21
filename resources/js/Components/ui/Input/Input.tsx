import React, { InputHTMLAttributes } from "react";

export interface PropTypes extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    id?: string;
    name?: string;
    required?: boolean;
    error?: string;
    icon?: React.ReactNode;
    rightElement?: React.ReactNode;
    type?: string;
    placehoder?: string;
    className?: string;
}

const Input = (props: PropTypes) => {
    const {
        label,
        id,
        name,
        required,
        error,
        icon,
        rightElement,
        placehoder,
        placeholder,
        className = '',
        type = 'text',
        ...rest
    } = props;

    const inputPlaceholder = placehoder || placeholder;

    return (
        <div className="flex flex-col gap-1.5 w-full">
            {label && (
                <label
                    htmlFor={id}
                    className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center justify-between"
                >
                    <span>
                        {label} {required && <span className="text-rose-500">*</span>}
                    </span>
                </label>
            )}

            <div className="relative flex items-center w-full">
                {icon && (
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        {icon}
                    </div>
                )}

                <input
                    type={type}
                    id={id}
                    name={name}
                    required={required}
                    placeholder={inputPlaceholder}
                    className={`w-full py-3 bg-slate-50/70 border-[#3A86FF] text-sm text-slate-800 placeholder-slate-400 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-[#3A86FF]/25 focus:border-[#3A86FF] transition-all duration-200 ${
                        icon ? 'pl-11' : 'pl-4'
                    } ${
                        rightElement ? 'pr-11' : 'pr-4'
                    } ${
                        error
                            ? 'border-rose-400 bg-rose-50/20 focus:border-rose-500 focus:ring-rose-500/20'
                            : 'border-slate-200 hover:border-slate-300'
                    } ${className}`}
                    {...rest}
                />

                {rightElement && (
                    <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center">
                        {rightElement}
                    </div>
                )}
            </div>

            {error && (
                <span className="text-rose-500 text-xs font-medium flex items-center gap-1 mt-0.5">
                    <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {error}
                </span>
            )}
        </div>
    );
};

export default Input;
