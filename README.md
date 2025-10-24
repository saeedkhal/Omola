# 🛋️ Sofa Customizer

A React web application for customizing sofas with real-time 3D visualization using Three.js and React Three Fiber.

## Features

- **Real-time 3D Visualization**: Interactive 3D sofa model with smooth controls
- **Color Customization**: Color picker and predefined color swatches
- **Dimension Adjustment**: Sliders and input fields for width, height, and depth
- **Instant Updates**: See changes in real-time as you customize
- **Reset Functionality**: Restore default settings with one click
- **Configuration Saving**: Save and view your custom configurations
- **Responsive Design**: Clean UI built with Tailwind CSS
- **Performance Optimized**: Lazy loading, Suspense, and efficient rendering

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd sofa-customizer
```

2. Install dependencies:
```bash
npm install
```

3. Add your 3D sofa model:
   - Place your `.glb` or `.gltf` file in the `public` folder
   - Update the model path in `src/components/SofaScene.js` (line 15):
   ```javascript
   const { scene } = useGLTF('/your-sofa-model.glb');
   ```

4. Start the development server:
```bash
npm start
```

5. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Project Structure

```
src/
├── components/
│   ├── SofaScene.js      # 3D scene and model component
│   └── ControlPanel.js   # UI controls for customization
├── App.js               # Main application component
├── index.js             # Application entry point
└── index.css            # Global styles with Tailwind

public/
├── sofa.glb             # Your 3D sofa model (replace with your own)
├── index.html
└── manifest.json
```

## 3D Model Requirements

### Supported Formats
- `.glb` (recommended - binary format, smaller file size)
- `.gltf` (JSON format)

### Model Guidelines
1. **Materials**: Use `MeshStandardMaterial` or `MeshPhongMaterial` for proper color changes
2. **Scale**: Model should be reasonably sized (1-3 units in Blender/3D software)
3. **Origin**: Center the model at origin (0,0,0)
4. **Textures**: Include UV mapping for texture support
5. **Optimization**: Keep polygon count reasonable for web performance

### Creating Your Own Model

1. **In Blender**:
   - Model your sofa
   - Apply materials with `Principled BSDF` shader
   - Export as GLB format
   - Ensure materials are named consistently

2. **In other 3D software**:
   - Export as GLB/GLTF
   - Ensure materials are compatible with Three.js

## Customization Guide

### Changing Colors
The app automatically detects materials and applies color changes. To ensure compatibility:

```javascript
// In SofaScene.js - Material detection
if (material.isMeshStandardMaterial || material.isMeshPhongMaterial) {
  material.color.setHex(color.replace('#', '0x'));
  material.needsUpdate = true;
}
```

### Adjusting Dimensions
Dimensions are applied as scale transformations:

```javascript
// Scale the entire model
meshRef.current.scale.set(dimensions.width, dimensions.height, dimensions.depth);
```

### Adding New Features
1. **New Controls**: Add to `ControlPanel.js`
2. **3D Effects**: Modify `SofaScene.js`
3. **Backend Integration**: Update `App.js` save handlers

## Backend Integration

### API Structure Example

```javascript
// POST /api/configurations
{
  "color": "#8B4513",
  "dimensions": {
    "width": 2.0,
    "height": 0.8,
    "depth": 0.9
  },
  "userId": "user123",
  "timestamp": "2024-01-01T00:00:00.000Z"
}

// GET /api/configurations/:userId
// Returns array of saved configurations

// PUT /api/configurations/:id
// Update existing configuration

// DELETE /api/configurations/:id
// Delete configuration
```

### Node.js/Express Backend Example

```javascript
const express = require('express');
const mongoose = require('mongoose');

const ConfigurationSchema = new mongoose.Schema({
  userId: String,
  color: String,
  dimensions: {
    width: Number,
    height: Number,
    depth: Number
  },
  timestamp: Date
});

app.post('/api/configurations', async (req, res) => {
  try {
    const config = new Configuration(req.body);
    await config.save();
    res.json(config);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### Database Schema (MongoDB)

```javascript
{
  _id: ObjectId,
  userId: String,
  color: String,
  dimensions: {
    width: Number,
    height: Number,
    depth: Number
  },
  timestamp: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## Performance Optimization

### Implemented Optimizations

1. **Suspense Boundaries**: Lazy loading of 3D models
2. **useMemo**: Memoized expensive calculations
3. **useCallback**: Optimized event handlers
4. **Shadow Optimization**: Efficient shadow mapping
5. **Material Caching**: Reused material instances

### Additional Optimizations

1. **Model Compression**: Use Draco compression for GLB files
2. **Texture Optimization**: Compress textures (WebP, JPEG)
3. **LOD (Level of Detail)**: Multiple model resolutions
4. **Instancing**: For multiple sofas
5. **Frustum Culling**: Only render visible objects

### Performance Monitoring

```javascript
// Add to SofaScene.js
import { useFrame } from '@react-three/fiber';

function PerformanceMonitor() {
  useFrame((state) => {
    console.log('FPS:', Math.round(1 / state.clock.getDelta()));
  });
  return null;
}
```

## Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Vercel/Netlify

1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `build`
4. Deploy!

### Environment Variables

```bash
# .env.local
REACT_APP_API_URL=https://your-api.com
REACT_APP_MODEL_PATH=/sofa.glb
```

## Troubleshooting

### Common Issues

1. **Model Not Loading**:
   - Check file path in `useGLTF`
   - Ensure model is in `public` folder
   - Verify GLB/GLTF format

2. **Colors Not Changing**:
   - Check material types in model
   - Ensure materials are named correctly
   - Verify material detection code

3. **Performance Issues**:
   - Reduce polygon count
   - Compress textures
   - Enable Draco compression

4. **Controls Not Working**:
   - Check OrbitControls setup
   - Verify PresentationControls configuration

### Debug Mode

```javascript
// Enable Three.js debug info
import { useThree } from '@react-three/fiber';

function DebugInfo() {
  const { scene } = useThree();
  console.log('Scene objects:', scene.children);
  return null;
}
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
- Create an issue on GitHub
- Check the troubleshooting section
- Review Three.js documentation

---

**Happy Customizing! 🛋️✨**