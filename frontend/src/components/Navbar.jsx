import React from 'react';
import { ChefHat, Plus, Sparkles } from 'lucide-react';

export const Navbar = ({ onOpenAddModal, onSeedData, isSeeding }) => {
  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <div className="brand" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="brand-icon-wrapper">
            <ChefHat size={24} />
          </div>
          <div className="brand-text">
            <h1>SavorySecrets</h1>
            <span>Recipe Vault</span>
          </div>
        </div>

        <div className="nav-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onSeedData}
            disabled={isSeeding}
            title="Seed database with sample delicious recipes"
          >
            <Sparkles size={16} />
            <span>{isSeeding ? 'Seeding...' : 'Load Demo Data'}</span>
          </button>

          <button
            type="button"
            className="btn btn-primary"
            onClick={onOpenAddModal}
          >
            <Plus size={18} />
            <span>Add Recipe</span>
          </button>
        </div>
      </div>
    </nav>
  );
};
