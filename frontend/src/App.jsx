import React, { useState, useEffect, useCallback } from 'react';
import { Search, Sparkles, BookOpen, Clock, Heart } from 'lucide-react';
import { api } from './services/api';
import { Navbar } from './components/Navbar';
import { RecipeCard } from './components/RecipeCard';
import { RecipeFormModal } from './components/RecipeFormModal';
import { RecipeDetailsModal } from './components/RecipeDetailsModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { EmptyState } from './components/EmptyState';
import { Toast } from './components/Toast';

const CATEGORIES = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Snack', 'Dessert', 'Beverage', 'Other'];

export default function App() {
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [detailsRecipe, setDetailsRecipe] = useState(null);
  const [deletingRecipe, setDeletingRecipe] = useState(null);

  // Async action states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);

  // Toasts
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random().toString(36).substring(2, 6);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  const dismissToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Load recipes from API
  const loadRecipes = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await api.getAll({
        category: selectedCategory,
        search: searchQuery
      });
      setRecipes(data);
    } catch (err) {
      console.error('Error fetching recipes:', err);
      showToast(err.message || 'Failed to load recipes from backend', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [selectedCategory, searchQuery, showToast]);

  useEffect(() => {
    loadRecipes();
  }, [loadRecipes]);

  // Handle Add or Edit Submit
  const handleFormSubmit = async (formData) => {
    try {
      setIsSubmitting(true);
      if (editingRecipe && editingRecipe._id) {
        // Edit mode
        const updated = await api.update(editingRecipe._id, formData);
        showToast(`Recipe "${updated.recipeName}" updated successfully!`, 'success');
        setIsFormOpen(false);
        setEditingRecipe(null);
        // Refresh recipes list automatically
        await loadRecipes();
      } else {
        // Add mode
        const created = await api.create(formData);
        showToast(`Recipe "${created.recipeName}" added successfully!`, 'success');
        setIsFormOpen(false);
        // Refresh recipes list automatically
        await loadRecipes();
      }
    } catch (err) {
      console.error('Form submit error:', err);
      showToast(err.message || 'Could not save recipe', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Delete Confirm
  const handleDeleteConfirm = async (id) => {
    try {
      setIsDeleting(true);
      const res = await api.delete(id);
      showToast(res.message || 'Recipe deleted successfully!', 'success');
      setDeletingRecipe(null);
      // Auto-refresh recipe list
      await loadRecipes();
    } catch (err) {
      console.error('Delete error:', err);
      showToast(err.message || 'Could not delete recipe', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  // Quick Seed Demo Data
  const handleSeedData = async () => {
    try {
      setIsSeeding(true);
      const res = await api.seed();
      showToast(res.message || 'Sample recipes loaded!', 'success');
      await loadRecipes();
    } catch (err) {
      console.error('Seed error:', err);
      showToast(err.message || 'Could not load sample data', 'error');
    } finally {
      setIsSeeding(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingRecipe(null);
    setIsFormOpen(true);
  };

  const handleOpenEditModal = (recipe) => {
    setEditingRecipe(recipe);
    setIsFormOpen(true);
  };

  const isFiltered = selectedCategory !== 'All' || searchQuery.trim().length > 0;

  return (
    <div className="app-container">
      {/* Navigation Bar */}
      <Navbar
        onOpenAddModal={handleOpenAddModal}
        onSeedData={handleSeedData}
        isSeeding={isSeeding}
      />

      {/* Hero Header */}
      <section className="hero-section">
        <div className="hero-inner">
          <div className="hero-badge">
            <Sparkles size={14} />
            <span>MERN Stack Recipe Book</span>
          </div>
          <h1 className="hero-title">
            Curate, Cook & Cherish Your <span>Favorite Recipes</span>
          </h1>
          <p className="hero-subtitle">
            A full-featured cookbook application with real-time MongoDB Atlas integration, category filtering, and instant updates.
          </p>
        </div>
      </section>

      {/* Search & Category Filter Controls */}
      <div className="controls-container">
        <div className="controls-card">
          <div className="search-box">
            <Search className="search-icon" size={18} />
            <input
              type="text"
              className="search-input"
              placeholder="Search recipes by name..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="category-pills">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                type="button"
                className={`pill-btn ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Recipe Grid / Content */}
      <main className="main-content">
        <div className="section-header">
          <h2 className="section-title">
            <BookOpen size={20} color="#ea580c" />
            <span>
              {selectedCategory === 'All' ? 'All Recipes' : `${selectedCategory} Recipes`}
            </span>
            <span className="recipe-count-badge">
              {recipes.length} {recipes.length === 1 ? 'item' : 'items'}
            </span>
          </h2>
        </div>

        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: '#64748b' }}>
            <div style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>
              Loading recipes...
            </div>
            <p style={{ fontSize: '0.85rem' }}>Fetching records from MongoDB backend</p>
          </div>
        ) : recipes.length === 0 ? (
          <EmptyState
            isFiltered={isFiltered}
            onResetFilter={() => {
              setSelectedCategory('All');
              setSearchQuery('');
            }}
            onOpenAddModal={handleOpenAddModal}
          />
        ) : (
          <div className="recipe-grid">
            {recipes.map(recipe => (
              <RecipeCard
                key={recipe._id}
                recipe={recipe}
                onViewDetails={setDetailsRecipe}
                onEdit={handleOpenEditModal}
                onDelete={setDeletingRecipe}
              />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="footer">
        <div>
          Recipe Book Web Application &bull; Built with MERN Stack (MongoDB Atlas, Express.js, React.js, Node.js)
        </div>
      </footer>

      {/* Modals */}
      <RecipeFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingRecipe(null);
        }}
        onSubmit={handleFormSubmit}
        initialData={editingRecipe}
        isSubmitting={isSubmitting}
      />

      <RecipeDetailsModal
        isOpen={Boolean(detailsRecipe)}
        recipe={detailsRecipe}
        onClose={() => setDetailsRecipe(null)}
        onEdit={handleOpenEditModal}
        onDelete={setDeletingRecipe}
      />

      <DeleteConfirmModal
        isOpen={Boolean(deletingRecipe)}
        recipe={deletingRecipe}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingRecipe(null)}
        isDeleting={isDeleting}
      />

      {/* Toast Notifications */}
      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
