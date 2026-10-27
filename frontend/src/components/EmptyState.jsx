import React from 'react';
import { ChefHat, Plus, RotateCcw } from 'lucide-react';

export const EmptyState = ({ isFiltered, onResetFilter, onOpenAddModal }) => {
  return (
    <div className="empty-state">
      <div className="empty-icon">
        <ChefHat size={32} />
      </div>
      <h3 className="empty-title">
        {isFiltered ? 'No Matching Recipes Found' : 'Your Recipe Book is Empty'}
      </h3>
      <p className="empty-desc">
        {isFiltered
          ? "We couldn't find any recipes matching your current filter or search criteria."
          : 'Start building your personal culinary collection by adding your first favorite recipe!'}
      </p>

      {isFiltered ? (
        <button type="button" className="btn btn-secondary" onClick={onResetFilter}>
          <RotateCcw size={16} />
          <span>Reset Filters</span>
        </button>
      ) : (
        <button type="button" className="btn btn-primary" onClick={onOpenAddModal}>
          <Plus size={18} />
          <span>Add First Recipe</span>
        </button>
      )}
    </div>
  );
};
