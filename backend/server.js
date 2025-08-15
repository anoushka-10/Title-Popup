const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sequelize = require('./config/database');
const Profile = require('./models/Profile');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

async function initDatabase() {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    
    // Sync models
    await sequelize.sync({ force: false });
    console.log('Database synced successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

app.get('/', (req, res) => {
  res.json({ message: 'LinkedIn Profile Scraper API is running!' });
});

app.post('/api/profiles', async (req, res) => {
  try {
    const {
      name,
      url,
      about,
      bio,
      location,
      followerCount,
      connectionCount
    } = req.body;

    if (!name || !url) {
      return res.status(400).json({
        error: 'Name and URL are required fields'
      });
    }

    const existingProfile = await Profile.findOne({ where: { url } });
    if (existingProfile) {
      await existingProfile.update({
        name,
        about,
        bio,
        location,
        followerCount: parseInt(followerCount) || 0,
        connectionCount: parseInt(connectionCount) || 0
      });
      
      return res.status(200).json({
        message: 'Profile updated successfully',
        profile: existingProfile
      });
    }

    const profile = await Profile.create({
      name,
      url,
      about,
      bio,
      location,
      followerCount: parseInt(followerCount) || 0,
      connectionCount: parseInt(connectionCount) || 0
    });

    res.status(201).json({
      message: 'Profile created successfully',
      profile
    });

  } catch (error) {
    console.error('Error saving profile:', error);
    res.status(500).json({
      error: 'Failed to save profile',
      details: error.message
    });
  }
});

app.get('/api/profiles', async (req, res) => {
  try {
    const profiles = await Profile.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.json(profiles);
  } catch (error) {
    console.error('Error fetching profiles:', error);
    res.status(500).json({
      error: 'Failed to fetch profiles',
      details: error.message
    });
  }
});

app.listen(PORT, async () => {
  await initDatabase();
  console.log(`Server is running on http://localhost:${PORT}`);
});