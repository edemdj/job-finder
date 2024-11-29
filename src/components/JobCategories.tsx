import { Briefcase, Code, Building2, Pencil, ShoppingBag, Utensils } from 'lucide-react';

const categories = [
  { icon: Briefcase, name: 'Administration', count: 145 },
  { icon: Code, name: 'Technologie', count: 230 },
  { icon: Building2, name: 'Construction', count: 89 },
  { icon: Pencil, name: 'Design', count: 120 },
  { icon: ShoppingBag, name: 'Vente', count: 167 },
  { icon: Utensils, name: 'Restauration', count: 94 },
];

export default function JobCategories() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
      {categories.map((category) => (
        <div
          key={category.name}
          className="flex flex-col items-center rounded-lg bg-white p-6 shadow-sm transition-all hover:shadow-md"
        >
          <category.icon className="mb-3 h-8 w-8 text-blue-600" />
          <h3 className="text-lg font-medium text-gray-900">{category.name}</h3>
          <p className="mt-1 text-sm text-gray-500">{category.count} offres</p>
        </div>
      ))}
    </div>
  );
}