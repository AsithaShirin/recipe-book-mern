import React from 'react';
import { Clock, Eye, Edit3, Trash2, ListChecks, Utensils } from 'lucide-react';

export const RecipeCard = ({ recipe, onViewDetails, onEdit, onDelete }) => {
  const { _id, recipeName, category, cookingTime, ingredients, preparationSteps } = recipe;

  const ingredientCount = Array.isArray(ingredients) ? ingredients.length : 0;
  const stepCount = Array.isArray(preparationSteps) ? preparationSteps.length : 0;

  return (
    <div className="recipe-card">
      <div className="card-top-banner" />
      <div className="card-body">
        <div className="card-meta">
          <span className={`category-badge badge-${category || 'Other'}`}>
            {category || 'Other'}
          </span>
          <div className="time-indicator">
            <Clock size={14} />
            <span>{cookingTime} mins</span>
          </div>
        </div>

        <h3
          className="recipe-title"
          onClick={() => onViewDetails(recipe)}
          title="Click to view details"
        >
          {recipeName}
        </h3>

        <div className="card-preview-info">
          <div className="preview-stat">
            <Utensils size={14} />
            <span>{ingredientCount} {ingredientCount === 1 ? 'ingredient' : 'ingredients'}</span>
          </div>
          <div className="preview-stat">
            <ListChecks size={14} />
            <span>{stepCount} {stepCount === 1 ? 'step' : 'steps'}</span>
          </div>
        </div>

        <div className="card-footer-actions">
          <button
            type="button"
            className="btn-view-details"
            onClick={() => onViewDetails(recipe)}
          >
            <Eye size={15} />
            <span>View Recipe</span>
          </button>

          <button
            type="button"
            className="btn-icon-sm edit"
            onClick={() => onEdit(recipe)}
            title="Edit Recipe"
            aria-label="Edit Recipe"
          >
            <Edit3 size={16} />
          </button>

          <button
            type="button"
            className="btn-icon-sm delete"
            onClick={() => onDelete(recipe)}
            title="Delete Recipe"
            aria-label="Delete Recipe"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
