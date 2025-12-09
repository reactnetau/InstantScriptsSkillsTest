const path = require('path');
const express = require('express');
const webpack = require('webpack');
const config = require('./webpack.config.dev');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const { createProxyMiddleware } = require('http-proxy-middleware'); // modern replacement
const { MongoClient, ObjectId } = require('mongodb');
const User = require('./src/models/User');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017';
const DB_NAME = 'instant_scripts_dev';
let db;
let userModel;


MongoClient.connect(MONGO_URI)
  .then((client) => {
    console.log('✓ Connected to MongoDB');
    db = client.db(DB_NAME);
    userModel = new User(db);

    initializeDatabase();
  })
  .catch((err) => {
    console.error('✗ MongoDB connection error:', err);
    process.exit(1);
  });

async function initializeDatabase() {
  await db.command({
    collMod: 'users',
    validator: {
      $jsonSchema: {
        bsonType: 'object',
        required: ['id', 'name', 'createdAt'],
        properties: {
          _id: { bsonType: 'objectId' },

          id: {
            bsonType: ['int', 'long', 'double'],
            description: 'unique user id'
          },

          name: {
            bsonType: 'string',
            minLength: 1,
            maxLength: 100
          },

          createdAt: {
            bsonType: 'string'
          },

          scores: {
            bsonType: 'object',
            patternProperties: {
              '^[a-zA-Z0-9_-]+$': {
                bsonType: 'object',
                required: ['win', 'loss', 'draw', 'createdAt'],
                properties: {
                  win: { bsonType: ['int', 'long', 'double'], minimum: 0 },
                  loss: { bsonType: ['int', 'long', 'double'], minimum: 0 },
                  draw: { bsonType: ['int', 'long', 'double'], minimum: 0 },
                  createdAt: { bsonType: 'string' }
                }
              }
            }
          },

          streak: {
            bsonType: ['int', 'long', 'double'],
            minimum: 0
          },

          maxStreak: {
            bsonType: ['int', 'long', 'double'],
            minimum: 0
          },

          achievements: {
            bsonType: 'array'
          },

          history: {
            bsonType: 'array'
          }
        }
      }
    },
    validationLevel: 'moderate',
    validationAction: 'error'
  }).catch((err)=> {
    if (err.codeName !== 'NamespaceNotFound') {
      console.warn('Schema update warning:', err.message);
    }
  });
}
const app = express();

const compiler = webpack(config);

app.use(
  webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath,
    stats: 'minimal', // less verbose output
  })
);

app.use(express.json());
// Webpack Hot Middleware
app.use(webpackHotMiddleware(compiler));

// Static files
app.use(express.static(path.join(__dirname, 'static')));

// Proxy /images requests
app.use(
  '/images',
  createProxyMiddleware({
    target: 'http://z2/projs/kisla/X-react-starter/dev/WS/images',
    changeOrigin: true,
    pathRewrite: {
      '^/images': '', // optional, if your backend paths don't have /images prefix
    },
  })
);

// SPA fallback
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'static', 'index.html'));
});

const PORT = 3000;
app.listen(PORT, '0.0.0.0', (err) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(`Listening at http://0.0.0.0:${PORT}`);
});

// ==================== API Routes ====================

// GET all users
app.get('/api/users', async (req, res) => {
  try {
    const users = await userModel.findAll();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET user by name
app.get('/api/users', async (req, res) => {
  try {
    const user = await userModel.findByName(req.body.name);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create new user
app.post('/api/users', async (req, res) => {
  try {
    if (!req.body.name) return res.status(400).json({ error: 'Name is required' });

    const existingUser = await userModel.findByName(req.body.name.trim());
    if (existingUser) {
      return res.status(409).json({ 
        error: 'User with this name already exists',
        existingUserId: existingUser.id
      });
    }

    const newUser = await userModel.create(req.body);
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


// GET all scores for a user
app.get('/api/users/:id/scores', async (req, res) => {
  try {
    const scores = await userModel.getScores(req.params.id);
    res.json(scores);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// POST add a new score for a user
app.post('/api/users/scores', async (req, res) => {
  try {
    // Each call creates a new object in scores array
    const score = await userModel.addScore(req.body.name, req.body);
    res.status(201).json(score);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET leaderboard (top users by wins)
app.get('/api/scores/leaderboard', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const leaderboard = await userModel.getLeaderboard(limit);
    res.json(leaderboard);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});