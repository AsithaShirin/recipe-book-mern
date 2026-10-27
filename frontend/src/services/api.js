const API_HOST = import.meta.env.VITE_API_BASE_URL || '';
const API_BASE = `${API_HOST}/api/recipes`;

export const api = {
  // Get all recipes with optional category and search filter
  getAll: async (params = {}) => {
    const query = new URLSearchParams();
    if (params.category && params.category !== 'All') {
      query.append('category', params.category);
    }
    if (params.search && params.search.trim()) {
      query.append('search', params.search.trim());
    }

    const url = query.toString() ? `${API_BASE}?${query.toString()}` : API_BASE;
    const res = await fetch(url);
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to fetch recipes');
    }
    return data.data || [];
  },

  // Get single recipe by ID
  getById: async (id) => {
    const res = await fetch(`${API_BASE}/${id}`);
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to fetch recipe details');
    }
    return data.data;
  },

  // Create new recipe
  create: async (recipeData) => {
    const res = await fetch(API_BASE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(recipeData)
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to create recipe');
    }
    return data.data;
  },

  // Update existing recipe
  update: async (id, recipeData) => {
    const res = await fetch(`${API_BASE}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(recipeData)
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to update recipe');
    }
    return data.data;
  },

  // Delete recipe
  delete: async (id) => {
    const res = await fetch(`${API_BASE}/${id}`, {
      method: 'DELETE'
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to delete recipe');
    }
    return data;
  },

  // Quick Seed database for demo
  seed: async () => {
    const res = await fetch(`${API_HOST}/api/seed`, { method: 'POST' });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to seed sample recipes');
    }
    return data;
  }
};
