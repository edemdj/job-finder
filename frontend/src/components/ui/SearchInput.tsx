import { InputHTMLAttributes, forwardRef } from 'react';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {}

const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, ...props }, ref) => {
    return (
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
        <input
          ref={ref}
          className={cn(
            'h-12 w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500',
            className
          )}
          {...props}
        />
      </div>
    );
  }
);

SearchInput.displayName = 'SearchInput';

export default SearchInput;