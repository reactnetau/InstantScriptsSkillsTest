const { ObjectId } = require('mongodb');

class User {
  constructor(db) {
    this.collection = db.collection('users');
  }

  /**
   * Find all users
   */
  async findAll() {
    return await this.collection.find({}).toArray();
  }

  /**
   * Find user by id
   */
  async findById(id) {
    return await this.collection.findOne({ id: parseInt(id) });
  }

  /**
   * Find user by name
   */
  async findByName(name) {
    return await this.collection.findOne({ name });
  }

  /**
   * Create new user
   */
  async create(userData) {
  // Validate required fields
  if (!userData.name || typeof userData.name !== 'string' || userData.name.trim().length === 0) {
    throw new Error('User name is required and must be a non-empty string');
  }

  // Check if user already exists
  const existingUser = await this.findByName(userData.name.trim());
  if (existingUser) {
    throw new Error('User already exists');
  }

  // Get next id
  const maxIdUser = await this.collection.findOne({}, { sort: { id: -1 } });
  const nextId = maxIdUser ? maxIdUser.id + 1 : 1;

  // Build user object
  const now = new Date().toISOString();
  const newUser = {
    id: nextId,
    name: userData.name.trim(),
    createdAt: now,
    scores: {
      ttt: { win: 0, loss: 0, draw: 0 }
    }
  };

  // Insert into collection
  const result = await this.collection.insertOne(newUser);

  return { ...newUser, _id: result.insertedId };
}

  /**
   * Update user by id
   */
  async update(id, updateData) {
    const result = await this.collection.updateOne(
      { id: parseInt(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      throw new Error('User not found');
    }

    return await this.findById(id);
  }

  /**
   * Delete user by id
   */
  async delete(id) {
    const result = await this.collection.deleteOne({ id: parseInt(id) });

    if (result.deletedCount === 0) {
      throw new Error('User not found');
    }

    return { message: 'User deleted successfully' };
  }

  /**
   * Add score to user
   */
  async addScore(name, scoreData) {
  if (!scoreData.gameType) {
    throw new Error('gameType is required');
  }

  const user = await this.collection.findOne({ name });
  if (!user) throw new Error('User not found');

  const gameType = scoreData.gameType;

  // Initialize scores as an object if it doesn't exist
  if (!user.scores || typeof user.scores !== 'object') {
    user.scores = {};
  }

  // Increment or create score entry
  if (!user.scores[gameType]) {
    user.scores[gameType] = { win: 0, loss: 0, draw: 0, createdAt: new Date().toISOString() };
  }

  user.scores[gameType].win += scoreData.win || 0;
  user.scores[gameType].loss += scoreData.loss || 0;
  user.scores[gameType].draw += scoreData.draw || 0;

  await this.collection.updateOne({ name }, { $set: { scores: user.scores } });

  return user.scores[gameType];
}
  /**
   * Get user scores
   */
  async getScores(userId) {
    const user = await this.findById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    return user.scores || [];
  }

  /**
   * Update user scores
   */
  async updateScores(userId, scores) {
    const result = await this.collection.updateOne(
      { id: parseInt(userId) },
      { $set: { scores } }
    );

    if (result.matchedCount === 0) {
      throw new Error('User not found');
    }

    return scores;
  }

  /**
   * Get leaderboard (top scores)
   */
  async getLeaderboard(limit = 10) {
    const users = await this.collection
      .aggregate([
        {
          $addFields: {
            totalWins: {
              $sum: '$scores.win'
            }
          }
        },
        { $sort: { totalWins: -1 } },
        { $limit: limit }
      ])
      .toArray();

    return users;
  }
}

module.exports = User;