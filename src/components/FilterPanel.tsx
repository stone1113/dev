import React from 'react';
import { AdvancedFilterPanel } from './AdvancedFilterPanel';

interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative w-96 h-full bg-white shadow-2xl animate-in slide-in-from-right duration-300">
        <AdvancedFilterPanel onClose={onClose} />
      </div>
    </div>
  );
};

export default FilterPanel;
