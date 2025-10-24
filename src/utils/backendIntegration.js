// Backend Integration Example
// This file shows how to integrate the sofa customizer with a Node.js backend

// Example API endpoints for saving/loading configurations

// 1. Save Configuration
const saveConfiguration = async (configuration) => {
  try {
    const response = await fetch('/api/configurations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}` // If using auth
      },
      body: JSON.stringify({
        ...configuration,
        userId: getCurrentUserId(), // Your user ID logic
        timestamp: new Date().toISOString()
      })
    });

    if (!response.ok) {
      throw new Error('Failed to save configuration');
    }

    const savedConfig = await response.json();
    console.log('Configuration saved:', savedConfig);
    return savedConfig;
  } catch (error) {
    console.error('Error saving configuration:', error);
    throw error;
  }
};

// 2. Load User Configurations
const loadUserConfigurations = async (userId) => {
  try {
    const response = await fetch(`/api/configurations/${userId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to load configurations');
    }

    const configurations = await response.json();
    return configurations;
  } catch (error) {
    console.error('Error loading configurations:', error);
    return [];
  }
};

// 3. Update Configuration
const updateConfiguration = async (configId, updates) => {
  try {
    const response = await fetch(`/api/configurations/${configId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(updates)
    });

    if (!response.ok) {
      throw new Error('Failed to update configuration');
    }

    const updatedConfig = await response.json();
    return updatedConfig;
  } catch (error) {
    console.error('Error updating configuration:', error);
    throw error;
  }
};

// 4. Delete Configuration
const deleteConfiguration = async (configId) => {
  try {
    const response = await fetch(`/api/configurations/${configId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to delete configuration');
    }

    return true;
  } catch (error) {
    console.error('Error deleting configuration:', error);
    throw error;
  }
};

// 5. Share Configuration (generate shareable link)
const shareConfiguration = async (configuration) => {
  try {
    const response = await fetch('/api/configurations/share', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(configuration)
    });

    if (!response.ok) {
      throw new Error('Failed to create shareable link');
    }

    const { shareId } = await response.json();
    return `${window.location.origin}/shared/${shareId}`;
  } catch (error) {
    console.error('Error creating shareable link:', error);
    throw error;
  }
};

// 6. Load Shared Configuration
const loadSharedConfiguration = async (shareId) => {
  try {
    const response = await fetch(`/api/configurations/shared/${shareId}`);
    
    if (!response.ok) {
      throw new Error('Failed to load shared configuration');
    }

    const configuration = await response.json();
    return configuration;
  } catch (error) {
    console.error('Error loading shared configuration:', error);
    throw error;
  }
};

// Example Node.js/Express backend implementation
/*
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Schema
const ConfigurationSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  color: { type: String, required: true },
  dimensions: {
    width: { type: Number, required: true },
    height: { type: Number, required: true },
    depth: { type: Number, required: true }
  },
  timestamp: { type: Date, default: Date.now },
  isShared: { type: Boolean, default: false },
  shareId: { type: String, unique: true, sparse: true }
});

const Configuration = mongoose.model('Configuration', ConfigurationSchema);

// Routes
app.post('/api/configurations', async (req, res) => {
  try {
    const config = new Configuration(req.body);
    await config.save();
    res.json(config);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/configurations/:userId', async (req, res) => {
  try {
    const configs = await Configuration.find({ userId: req.params.userId });
    res.json(configs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/configurations/:id', async (req, res) => {
  try {
    const config = await Configuration.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(config);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/configurations/:id', async (req, res) => {
  try {
    await Configuration.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/configurations/share', async (req, res) => {
  try {
    const shareId = Math.random().toString(36).substr(2, 9);
    const config = new Configuration({
      ...req.body,
      isShared: true,
      shareId: shareId
    });
    await config.save();
    res.json({ shareId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/configurations/shared/:shareId', async (req, res) => {
  try {
    const config = await Configuration.findOne({ shareId: req.params.shareId });
    if (!config) {
      return res.status(404).json({ error: 'Configuration not found' });
    }
    res.json(config);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
*/

// Usage in React component
export const useConfigurationAPI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const saveConfig = async (configuration) => {
    setLoading(true);
    setError(null);
    try {
      const result = await saveConfiguration(configuration);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const loadConfigs = async (userId) => {
    setLoading(true);
    setError(null);
    try {
      const result = await loadUserConfigurations(userId);
      return result;
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  return {
    saveConfig,
    loadConfigs,
    updateConfiguration,
    deleteConfiguration,
    shareConfiguration,
    loadSharedConfiguration,
    loading,
    error
  };
};

export {
  saveConfiguration,
  loadUserConfigurations,
  updateConfiguration,
  deleteConfiguration,
  shareConfiguration,
  loadSharedConfiguration
};
