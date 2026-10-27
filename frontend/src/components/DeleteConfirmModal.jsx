import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

export const DeleteConfirmModal = ({ isOpen, recipe, onConfirm, onCancel, isDeleting }) => {
  if (!isOpen || !recipe) return null;

  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div
        className="modal-content"
        style={{ maxWidth: 440 }}
        onClick={e => e.stopPropagation()}
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#dc2626' }}>
            <AlertTriangle size={22} />
            <h2 style={{ fontSize: '1.2rem', color: '#991b1b' }}>Delete Recipe?</h2>
          </div>
          <button
            type="button"
            className="btn-icon-sm"
            onClick={onCancel}
            aria-label="Cancel deletion"
          >
            <X size={20} />
          </button>
        </div>

        <div className="modal-body" style={{ textAlign: 'center', padding: '1.75rem 1.5rem' }}>
          <p style={{ color: '#475569', fontSize: '0.95rem', marginBottom: '0.75rem' }}>
            Are you sure you want to permanently remove:
          </p>
          <div
            style={{
              fontWeight: 700,
              fontSize: '1.1rem',
              color: '#0f172a',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              padding: '0.75rem',
              borderRadius: '8px',
              marginBottom: '1rem'
            }}
          >
            "{recipe.recipeName}"
          </div>
          <p style={{ color: '#dc2626', fontSize: '0.82rem', fontWeight: 500 }}>
            This action cannot be undone and will delete this recipe from MongoDB.
          </p>
        </div>

        <div className="modal-footer" style={{ justifyContent: 'center' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => onConfirm(recipe._id)}
            disabled={isDeleting}
          >
            <Trash2 size={15} />
            <span>{isDeleting ? 'Deleting...' : 'Yes, Delete Recipe'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
