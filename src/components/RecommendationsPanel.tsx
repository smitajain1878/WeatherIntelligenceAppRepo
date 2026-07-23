import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';

interface RecommendationsPanelProps {
  recommendations: string[];
  loading: boolean;
}

export default function RecommendationsPanel({ recommendations, loading }: RecommendationsPanelProps) {
  if (loading) {
    return (
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-6 md:p-8 border border-indigo-100/50 animate-pulse h-full min-h-[200px]">
        <div className="flex items-center gap-2 text-indigo-800/50 mb-6">
          <Sparkles size={20} />
          <div className="h-5 bg-indigo-200/50 rounded w-48"></div>
        </div>
        <div className="space-y-4">
          <div className="h-4 bg-indigo-200/50 rounded w-full"></div>
          <div className="h-4 bg-indigo-200/50 rounded w-5/6"></div>
          <div className="h-4 bg-indigo-200/50 rounded w-4/6"></div>
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-6 md:p-8 border border-indigo-100/50 h-full"
    >
      <div className="flex items-center gap-2 text-indigo-800 mb-6">
        <Sparkles size={20} className="text-indigo-500" />
        <h3 className="text-lg font-medium">Smart Planning</h3>
      </div>
      <ul className="space-y-4">
        {recommendations.map((rec, i) => (
          <li key={i} className="flex items-start gap-3 text-indigo-900/80">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 shrink-0" />
            <span className="leading-relaxed">{rec}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
