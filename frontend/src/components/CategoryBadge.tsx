import { Badge } from '@/components/ui/badge';
import {
    Briefcase,
    TrendingUp,
    Heart,
    Globe,
    Landmark,
    Atom,
    Palette,
    Trophy,
    Newspaper
} from 'lucide-react';

interface CategoryBadgeProps {
    category: string;
    size?: 'sm' | 'md';
}

const CATEGORIES = {
    politics: { label: 'Politics', icon: Landmark, color: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
    business: { label: 'Business', icon: Briefcase, color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
    technology: { label: 'Technology', icon: Atom, color: 'bg-blue-100 text-blue-700 border-blue-200' },
    health: { label: 'Health', icon: Heart, color: 'bg-rose-100 text-rose-700 border-rose-200' },
    world: { label: 'World', icon: Globe, color: 'bg-cyan-100 text-cyan-700 border-cyan-200' },
    sports: { label: 'Sports', icon: Trophy, color: 'bg-orange-100 text-orange-700 border-orange-200' },
    entertainment: { label: 'Entertainment', icon: Palette, color: 'bg-purple-100 text-purple-700 border-purple-200' },
    science: { label: 'Science', icon: Atom, color: 'bg-teal-100 text-teal-700 border-teal-200' },
    general: { label: 'General News', icon: Newspaper, color: 'bg-gray-100 text-gray-700 border-gray-200' },
};

export function CategoryBadge({ category, size = 'sm' }: CategoryBadgeProps) {
    const categoryKey = category.toLowerCase() as keyof typeof CATEGORIES;
    const categoryData = CATEGORIES[categoryKey] || CATEGORIES.general;
    const Icon = categoryData.icon;

    const sizeClasses = {
        sm: 'text-xs px-2 py-0.5',
        md: 'text-sm px-2.5 py-1'
    };

    const iconSizes = {
        sm: 'h-3 w-3',
        md: 'h-3.5 w-3.5'
    };

    return (
        <Badge
            variant="outline"
            className={`${categoryData.color} ${sizeClasses[size]} font-medium border flex items-center gap-1.5`}
        >
            <Icon className={iconSizes[size]} />
            <span>{categoryData.label}</span>
        </Badge>
    );
}
