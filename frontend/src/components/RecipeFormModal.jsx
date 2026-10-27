import React, { useState, useEffect } from 'react';
import { X, ChefHat, AlertCircle } from 'lucide-react';

const CATEGORIES = ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Dessert', 'Beverage', 'Other'];

export const RecipeFormModal = ({ isOpen, onClose, onSubmit, initialData = null, isSubmitting }) => {
  const [formData, setFormData] = useState({
    recipeName: '',
    category: 'Lunch',
    ingredients: '',
    preparationSteps: '',
    cookingTime: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        recipeName: initialData.recipeName || '',
        category: initialData.category || 'Lunch',
        ingredients: Array.isArray(initialData.ingredients)
          ? initialData.ingredients.join('\n')
          : initialData.ingredients || '',
        preparationSteps: Array.isArray(initialData.preparationSteps)
          ? initialData.preparationSteps.join('\n')
          : initialData.preparationSteps || '',
        cookingTime: initialData.cookingTime !== undefined ? String(initialData.cookingTime) : ''
      });
    } else {
      setFormData({
        recipeName: '',
        category: 'Lunch',
        ingredients: '',
        preparationSteps: '',
        cookingTime: ''
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear field-specific error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.recipeName.trim()) {
      newErrors.recipeName = 'Recipe name is required.';
    } else if (formData.recipeName.trim().length < 2) {
      newErrors.recipeName = 'Recipe name must be at least 2 characters.';
    }

    if (!formData.category) {
      newErrors.category = 'Please select a category.';
    }

    const timeNum = Number(formData.cookingTime);
    if (!formData.cookingTime || isNaN(timeNum)) {
      newErrors.cookingTime = 'Please enter a valid cooking time.';
    } else if (timeNum <= 0) {
      newErrors.cookingTime = 'Cooking time must be a positive number greater than 0.';
    } else if (!Number.isInteger(timeNum)) {
      newErrors.cookingTime = 'Cooking time must be a whole number of minutes.';
    }

    const parsedIngredients = formData.ingredients
      .split('\n')
      .map(i => i.trim())
      .filter(Boolean);
    if (parsedIngredients.length === 0) {
      newErrors.ingredients = 'Please enter at least one ingredient.';
    }

    const parsedSteps = formData.preparationSteps
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);
    if (parsedSteps.length === 0) {
      newErrors.preparationSteps = 'Please enter at least one preparation step.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const formattedPayload = {
      recipeName: formData.recipeName.trim(),
      category: formData.category,
      cookingTime: parseInt(formData.cookingTime, 10),
      ingredients: formData.ingredients
        .split('\n')
        .map(i => i.trim())
        .filter(Boolean),
      preparationSteps: formData.preparationSteps
        .split('\n')
        .map(s => s.trim())
        .filter(Boolean)
    };

    onSubmit(formattedPayload);
  };

  const isEditMode = Boolean(initialData && initialData._id);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <ChefHat size={22} color="#ea580c" />
            <h2>{isEditMode ? 'Edit Recipe' : 'Add New Recipe'}</h2>
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

        <form onSubmit={handleSubmit} noValidate>
          <div className="modal-body">
            {/* Recipe Name */}
            <div className="form-group">
              <label className="form-label" htmlFor="recipeName">
                Recipe Name <span className="req">*</span>
              </label>
              <input
                id="recipeName"
                name="recipeName"
                type="text"
                className="form-input"
                placeholder="e.g., Homemade Margherita Pizza"
                value={formData.recipeName}
                onChange={handleChange}
                autoFocus
              />
              {errors.recipeName && (
                <div className="form-error">
                  <AlertCircle size={13} style={{ display: 'inline', marginRight: 4 }} />
                  {errors.recipeName}
                </div>
              )}
            </div>

            {/* Category & Cooking Time Row */}
            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label" htmlFor="category">
                  Category <span className="req">*</span>
                </label>
                <select
                  id="category"
                  name="category"
                  className="form-select"
                  value={formData.category}
                  onChange={handleChange}
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <div className="form-error">
                    <AlertCircle size={13} style={{ display: 'inline', marginRight: 4 }} />
                    {errors.category}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="cookingTime">
                  Cooking Time (minutes) <span className="req">*</span>
                </label>
                <input
                  id="cookingTime"
                  name="cookingTime"
                  type="number"
                  min="1"
                  className="form-input"
                  placeholder="e.g., 30"
                  value={formData.cookingTime}
                  onChange={handleChange}
                />
                {errors.cookingTime && (
                  <div className="form-error">
                    <AlertCircle size={13} style={{ display: 'inline', marginRight: 4 }} />
                    {errors.cookingTime}
                  </div>
                )}
              </div>
            </div>

            {/* Ingredients */}
            <div className="form-group">
              <label className="form-label" htmlFor="ingredients">
                Ingredients <span className="req">*</span>
              </label>
              <textarea
                id="ingredients"
                name="ingredients"
                className="form-textarea"
                rows={4}
                placeholder="Enter each ingredient on a new line, e.g.:&#10;2 cups all-purpose flour&#10;1 tsp salt&#10;1/2 cup warm water"
                value={formData.ingredients}
                onChange={handleChange}
              />
              <div className="form-helper">Enter one ingredient per line.</div>
              {errors.ingredients && (
                <div className="form-error">
                  <AlertCircle size={13} style={{ display: 'inline', marginRight: 4 }} />
                  {errors.ingredients}
                </div>
              )}
            </div>

            {/* Preparation Steps */}
            <div className="form-group">
              <label className="form-label" htmlFor="preparationSteps">
                Preparation Steps <span className="req">*</span>
              </label>
              <textarea
                id="preparationSteps"
                name="preparationSteps"
                className="form-textarea"
                rows={5}
                placeholder="Enter each step on a new line, e.g.:&#10;Preheat oven to 400°F (200°C).&#10;Mix flour and salt in a bowl.&#10;Bake for 20 minutes until golden."
                value={formData.preparationSteps}
                onChange={handleChange}
              />
              <div className="form-helper">Enter each cooking step on a new line.</div>
              {errors.preparationSteps && (
                <div className="form-error">
                  <AlertCircle size={13} style={{ display: 'inline', marginRight: 4 }} />
                  {errors.preparationSteps}
                </div>
              )}
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? 'Saving...'
                : isEditMode
                ? 'Save Changes'
                : 'Create Recipe'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
