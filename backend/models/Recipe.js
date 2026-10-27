const mongoose = require('mongoose');

const RecipeSchema = new mongoose.Schema(
  {
    recipeName: {
      type: String,
      required: [true, 'Recipe name is required'],
      trim: true,
      minlength: [2, 'Recipe name must be at least 2 characters long'],
      maxlength: [120, 'Recipe name cannot exceed 120 characters']
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Dessert', 'Beverage', 'Other'],
        message: '{VALUE} is not a valid category'
      },
      default: 'Lunch'
    },
    ingredients: {
      type: [String],
      required: [true, 'Ingredients are required'],
      validate: {
        validator: function (val) {
          return Array.isArray(val) && val.length > 0 && val.some(item => item && item.trim().length > 0);
        },
        message: 'At least one ingredient is required'
      }
    },
    preparationSteps: {
      type: [String],
      required: [true, 'Preparation steps are required'],
      validate: {
        validator: function (val) {
          return Array.isArray(val) && val.length > 0 && val.some(step => step && step.trim().length > 0);
        },
        message: 'At least one preparation step is required'
      }
    },
    cookingTime: {
      type: Number,
      required: [true, 'Cooking time is required'],
      min: [1, 'Cooking time must be at least 1 minute'],
      validate: {
        validator: Number.isInteger,
        message: 'Cooking time must be a whole number of minutes'
      }
    }
  },
  {
    timestamps: true
  }
);

// Virtual alias so both recipeName or title can be accessed if needed
RecipeSchema.virtual('title').get(function () {
  return this.recipeName;
});

module.exports = mongoose.model('Recipe', RecipeSchema);
