const mongoose = require('mongoose');
const Recipe = require('../models/Recipe');

// Helper to normalize array fields (handles array or string separated by newlines/commas)
const normalizeStringArray = (input) => {
  if (Array.isArray(input)) {
    return input.map(item => String(item).trim()).filter(Boolean);
  }
  if (typeof input === 'string') {
    return input
      .split(/\r?\n|,/)
      .map(item => item.trim())
      .filter(Boolean);
  }
  return [];
};

// Helper for steps (prefer newline splitting)
const normalizeStepsArray = (input) => {
  if (Array.isArray(input)) {
    return input.map(item => String(item).trim()).filter(Boolean);
  }
  if (typeof input === 'string') {
    return input
      .split(/\r?\n/)
      .map(step => step.trim())
      .filter(Boolean);
  }
  return [];
};

// @desc    Get all recipes
// @route   GET /api/recipes
// @access  Public
exports.getAllRecipes = async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    if (search && search.trim()) {
      query.recipeName = { $regex: search.trim(), $options: 'i' };
    }

    const recipes = await Recipe.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: recipes.length,
      data: recipes
    });
  } catch (error) {
    console.error('Error in getAllRecipes:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve recipes. ' + error.message
    });
  }
};

// @desc    Get single recipe by ID
// @route   GET /api/recipes/:id
// @access  Public
exports.getRecipeById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Recipe ID format'
      });
    }

    const recipe = await Recipe.findById(id);

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: `Recipe with ID ${id} not found`
      });
    }

    res.status(200).json({
      success: true,
      data: recipe
    });
  } catch (error) {
    console.error('Error in getRecipeById:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve recipe details. ' + error.message
    });
  }
};

// @desc    Create a new recipe
// @route   POST /api/recipes
// @access  Public
exports.createRecipe = async (req, res) => {
  try {
    let { recipeName, title, category, ingredients, preparationSteps, cookingTime } = req.body;

    const finalName = (recipeName || title || '').trim();
    if (!finalName) {
      return res.status(400).json({
        success: false,
        message: 'Recipe Name is required and cannot be empty.'
      });
    }

    const parsedCookingTime = Number(cookingTime);
    if (!cookingTime || isNaN(parsedCookingTime) || parsedCookingTime <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Cooking Time must be a valid positive number greater than 0.'
      });
    }

    const parsedIngredients = normalizeStringArray(ingredients);
    if (parsedIngredients.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one ingredient must be provided.'
      });
    }

    const parsedSteps = normalizeStepsArray(preparationSteps);
    if (parsedSteps.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one preparation step must be provided.'
      });
    }

    const validCategories = ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Dessert', 'Beverage', 'Other'];
    if (category && !validCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        message: `Category must be one of: ${validCategories.join(', ')}`
      });
    }

    const newRecipe = await Recipe.create({
      recipeName: finalName,
      category: category || 'Lunch',
      ingredients: parsedIngredients,
      preparationSteps: parsedSteps,
      cookingTime: Math.round(parsedCookingTime)
    });

    res.status(201).json({
      success: true,
      message: 'Recipe created successfully!',
      data: newRecipe
    });
  } catch (error) {
    console.error('Error in createRecipe:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while creating recipe: ' + error.message
    });
  }
};

// @desc    Update an existing recipe
// @route   PUT /api/recipes/:id
// @access  Public
exports.updateRecipe = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Recipe ID format'
      });
    }

    let { recipeName, title, category, ingredients, preparationSteps, cookingTime } = req.body;
    const updateData = {};

    if (recipeName !== undefined || title !== undefined) {
      const finalName = (recipeName !== undefined ? recipeName : title).trim();
      if (!finalName) {
        return res.status(400).json({
          success: false,
          message: 'Recipe Name cannot be empty.'
        });
      }
      updateData.recipeName = finalName;
    }

    if (cookingTime !== undefined) {
      const parsedCookingTime = Number(cookingTime);
      if (isNaN(parsedCookingTime) || parsedCookingTime <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Cooking Time must be a valid positive number greater than 0.'
        });
      }
      updateData.cookingTime = Math.round(parsedCookingTime);
    }

    if (category !== undefined) {
      const validCategories = ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Dessert', 'Beverage', 'Other'];
      if (!validCategories.includes(category)) {
        return res.status(400).json({
          success: false,
          message: `Category must be one of: ${validCategories.join(', ')}`
        });
      }
      updateData.category = category;
    }

    if (ingredients !== undefined) {
      const parsedIngredients = normalizeStringArray(ingredients);
      if (parsedIngredients.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'At least one ingredient must be provided.'
        });
      }
      updateData.ingredients = parsedIngredients;
    }

    if (preparationSteps !== undefined) {
      const parsedSteps = normalizeStepsArray(preparationSteps);
      if (parsedSteps.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'At least one preparation step must be provided.'
        });
      }
      updateData.preparationSteps = parsedSteps;
    }

    const updatedRecipe = await Recipe.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedRecipe) {
      return res.status(404).json({
        success: false,
        message: `Recipe with ID ${id} not found`
      });
    }

    res.status(200).json({
      success: true,
      message: 'Recipe updated successfully!',
      data: updatedRecipe
    });
  } catch (error) {
    console.error('Error in updateRecipe:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while updating recipe: ' + error.message
    });
  }
};

// @desc    Delete a recipe
// @route   DELETE /api/recipes/:id
// @access  Public
exports.deleteRecipe = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Recipe ID format'
      });
    }

    const deletedRecipe = await Recipe.findByIdAndDelete(id);

    if (!deletedRecipe) {
      return res.status(404).json({
        success: false,
        message: `Recipe with ID ${id} not found`
      });
    }

    res.status(200).json({
      success: true,
      message: `Recipe "${deletedRecipe.recipeName}" deleted successfully!`,
      data: { id: deletedRecipe._id }
    });
  } catch (error) {
    console.error('Error in deleteRecipe:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting recipe: ' + error.message
    });
  }
};
