const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const recipeRoutes = require('./routes/recipeRoutes');
const Recipe = require('./models/Recipe');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/recipes', recipeRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Recipe Book Backend API is up and running!',
    timestamp: new Date().toISOString()
  });
});

// Quick seed route for demonstration/evaluators
app.post('/api/seed', async (req, res) => {
  try {
    const count = await Recipe.countDocuments();
    if (count > 0) {
      return res.status(200).json({
        message: `Database already has ${count} recipes. No seed needed.`
      });
    }

    const sampleRecipes = [
      {
        recipeName: 'Classic Italian Margherita Pizza',
        category: 'Dinner',
        ingredients: [
          '1 ball pizza dough',
          '1/2 cup San Marzano tomato sauce',
          '200g fresh mozzarella sliced',
          'Fresh basil leaves',
          '2 tbsp extra virgin olive oil',
          'Pinch of sea salt'
        ],
        preparationSteps: [
          'Preheat oven to 500°F (260°C) with a pizza stone inside.',
          'Roll and stretch the dough on parchment paper to a 12-inch circle.',
          'Spread tomato sauce evenly over the dough, leaving a 1/2-inch border.',
          'Arrange fresh mozzarella slices over the sauce and drizzle with olive oil.',
          'Bake for 10-12 minutes until crust is golden and cheese is bubbly.',
          'Garnish with fresh basil leaves and a sprinkle of sea salt before slicing.'
        ],
        cookingTime: 25
      },
      {
        recipeName: 'Fluffy Buttermilk Blueberry Pancakes',
        category: 'Breakfast',
        ingredients: [
          '2 cups all-purpose flour',
          '2 tbsp granulated sugar',
          '2 tsp baking powder',
          '1/2 tsp baking soda',
          '1/2 tsp salt',
          '2 cups buttermilk',
          '2 large eggs',
          '1/4 cup melted butter',
          '1 cup fresh blueberries',
          'Pure maple syrup for serving'
        ],
        preparationSteps: [
          'Whisk together flour, sugar, baking powder, baking soda, and salt in a large bowl.',
          'In another bowl, whisk buttermilk, eggs, and melted butter.',
          'Gently fold wet ingredients into dry ingredients until just combined (lumps are ok).',
          'Heat a buttered skillet or griddle over medium heat.',
          'Pour 1/4 cup batter for each pancake and dot with fresh blueberries.',
          'Cook until bubbles surface (2-3 mins), flip and cook until golden brown (1-2 mins).',
          'Serve warm with pure maple syrup and extra blueberries.'
        ],
        cookingTime: 20
      },
      {
        recipeName: 'Creamy Garlic Butter Tuscan Chicken',
        category: 'Dinner',
        ingredients: [
          '2 large boneless skinless chicken breasts (halved horizontally)',
          '1 tbsp olive oil',
          '2 tbsp butter',
          '6 cloves garlic minced',
          '1 cup heavy cream',
          '1/2 cup chicken broth',
          '1 cup sun-dried tomatoes drained',
          '3 cups fresh baby spinach',
          '1/2 cup grated parmesan cheese',
          'Italian seasoning, salt, and black pepper'
        ],
        preparationSteps: [
          'Season chicken cutlets with salt, pepper, and Italian seasoning.',
          'Heat olive oil and 1 tbsp butter in a large skillet over medium-high heat. Sear chicken 5 mins per side until golden and cooked through. Transfer to a plate.',
          'Melt remaining butter in the same pan. Sauté minced garlic for 1 minute until fragrant.',
          'Pour in chicken broth and heavy cream, bringing to a gentle simmer.',
          'Stir in parmesan cheese until smooth and creamy.',
          'Add sun-dried tomatoes and fresh spinach, cooking until spinach wilts (2-3 mins).',
          'Return chicken to the skillet, spooning the sauce on top, and simmer for 2 minutes. Serve hot.'
        ],
        cookingTime: 30
      },
      {
        recipeName: 'Crispy Avocado & Lime Corn Toast',
        category: 'Snack',
        ingredients: [
          '2 thick slices sourdough bread',
          '1 ripe avocado',
          '1/2 cup grilled sweet corn kernels',
          '1 tbsp fresh lime juice',
          '1/4 tsp chili flakes',
          '1 tbsp crumbled feta cheese',
          'Fresh cilantro and salt'
        ],
        preparationSteps: [
          'Toast sourdough slices until golden and crisp.',
          'Mash avocado in a small bowl with lime juice, salt, and pepper.',
          'Spread mashed avocado generously over toasted sourdough.',
          'Top with grilled sweet corn, crumbled feta, chili flakes, and fresh cilantro.',
          'Serve immediately with extra lime wedges.'
        ],
        cookingTime: 10
      },
      {
        recipeName: 'Warm Molten Chocolate Lava Cake',
        category: 'Dessert',
        ingredients: [
          '100g dark chocolate (70%) chopped',
          '1/2 cup unsalted butter',
          '2 large eggs + 2 egg yolks',
          '1/3 cup powdered sugar',
          '2 tbsp all-purpose flour',
          '1 tsp vanilla extract',
          'Pinch of salt',
          'Vanilla ice cream for serving'
        ],
        preparationSteps: [
          'Preheat oven to 425°F (220°C). Grease and dust two ramekins with cocoa powder.',
          'Melt dark chocolate and butter together in a heatproof bowl over simmering water.',
          'Whisk eggs, egg yolks, powdered sugar, and vanilla extract until pale and slightly thick.',
          'Fold melted chocolate mixture into the egg mixture.',
          'Gently fold in flour and salt until just combined.',
          'Divide batter into ramekins and bake for 12-14 minutes until sides are set but center remains soft.',
          'Invert onto plates and serve immediately with a scoop of vanilla ice cream.'
        ],
        cookingTime: 20
      }
    ];

    const seeded = await Recipe.insertMany(sampleRecipes);
    res.status(201).json({
      message: 'Sample recipes seeded successfully!',
      count: seeded.length,
      data: seeded
    });
  } catch (error) {
    res.status(500).json({ message: 'Seeding failed: ' + error.message });
  }
});

// Root route
app.get('/', (req, res) => {
  res.send('Recipe Book API is active. Access endpoints at /api/recipes');
});

// 404 Route handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.originalUrl} not found`
  });
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`[Server] Recipe Book backend listening on http://localhost:${PORT}`);
});
