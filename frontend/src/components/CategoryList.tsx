import React from 'react';

interface Props {
  categories: string[];
  active?: string | null;
  onSelect?: (cat: string) => void;
  className?: string;
}

/**
 * Affiche la liste de catégories sous forme de chips cliquables.
 * onSelect est appelé avec la catégorie sélectionnée.
 */
const CategoryList: React.FC<Props> = ({ categories, active = null, onSelect, className }) => {
  return (
    <div className={`flex flex-wrap gap-2 ${className || ''}`}>
      {categories.map((c) => {
        const isActive = active === c;
        return (
          <button
            key={c}
            type="button"
            onClick={() => onSelect?.(c)}
            className={`text-sm px-3 py-1 rounded-full transition ${
              isActive
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            aria-pressed={isActive}
          >
            {c}
          </button>
        );
      })}
    </div>
  );
};

export default CategoryList;