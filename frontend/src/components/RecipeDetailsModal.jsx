import React from 'react';
import { X, Clock, Edit3, Trash2, Utensils, ListOrdered, Calendar } from 'lucide-react';

export const RecipeDetailsModal = ({ recipe, isOpen, onClose, onEdit, onDelete }) => {
  if (!isOpen || !recipe) return null;

  const {
    recipeName,
    category,
    cookingTime,
    ingredients = [],
    preparationSteps = [],
    createdAt
  } = recipe;

  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    : null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className={`category-badge badge-${category || 'Other'}`}>
              {category || 'Other'}
            </span>
          </div>
          <button
            type="button"
            className="btn-icon-sm"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <div className="recipe-details-header">
            <h2 className="recipe-details-title">{recipeName}</h2>
            <div className="recipe-details-meta" style={{ marginTop: '0.5rem' }}>
              <div className="time-indicator">
                <Clock size={15} />
                <span>{cookingTime} minutes</span>
              </div>
              {formattedDate && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', color: '#64748b' }}>
                  <Calendar size={14} />
                  <span>Added {formattedDate}</span>
                </div>
              )}
            </div>
          </div>

          {/* Ingredients Section */}
          <div className="recipe-details-section">
            <h3>
              <Utensils size={18} />
              <span>Ingredients ({ingredients.length})</span>
            </h3>
            <ul className="ingredients-list">
              {ingredients.map((item, index) => (
                <li key={index} className="ingredient-item">
                  <span className="ingredient-bullet" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Preparation Steps Section */}
          <div className="recipe-details-section">
            <h3>
              <ListOrdered size={18} />
              <span>Preparation Steps ({preparationSteps.length})</span>
            </h3>
            <ol className="steps-list">
              {preparationSteps.map((step, index) => (
                <li key={index} className="step-item">
                  <div className="step-number">{index + 1}</div>
                  <div className="step-text">{step}</div>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              onClose();
              onDelete(recipe);
            }}
          >
            <Trash2 size={15} />
            <span>Delete</span>
          </button>

          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              onClose();
              onEdit(recipe);
            }}
          >
            <Edit3 size={15} />
            <span>Edit Recipe</span>
          </button>
        </div>
      </div>
    </div>
  );
};
