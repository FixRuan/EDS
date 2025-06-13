import type { InputHTMLAttributes, JSX } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  placeholder?: string;
  variant?: 'default' | 'dark';
  icon?: JSX.Element;
  hasDeleteButton?: boolean;
  deleteFunction?: () => void;
}

export function Input({ placeholder, icon, variant = 'default', hasDeleteButton = false, deleteFunction, ...rest }: InputProps) {
  return (
    <div className={`flex ${hasDeleteButton && 'relative'} items-center px-5 py-4 ${variant === 'default' ? 'bg-[#18191A]' : 'bg-gray-950'} border-b-2`}>
      {hasDeleteButton && (
        <button
          type="button"
          className={`absolute -right-2 -top-2 w-8 h-8 rounded-full bg-white text-lg font-bold`}
          onClick={deleteFunction}
        >
          X
        </button>
      )}
      {icon}
      <input
        className={`bg-transparent ${icon ? 'ml-5' : ''} text-[#FBFEFB] text-xl outline-none placeholder:text-[#FBFEFB]`}
        placeholder={placeholder}
        {...rest}
      />
    </div>
  )
}
