import React from 'react';
import { User } from 'lucide-react';

const TopExpertsDisplay = ({ experts }) => {
  return (
    <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-md">
      <h4 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Top Matching Experts</h4>
      <div className="space-y-2">
        {experts.map((expert, index) => (
          <div key={index} className="flex items-center space-x-2">
            <User size={20} className="text-gray-500 dark:text-gray-400" />
            <span className="text-sm text-gray-700 dark:text-gray-300">{expert.name} - {expert.position}</span>
            <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">{expert.score.toFixed(2)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopExpertsDisplay;