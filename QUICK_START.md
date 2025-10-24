# 🛋️ Sofa Customizer - Quick Start

## What You Have Now

✅ **Working 3D Sofa Renderer** - A geometric sofa made with Three.js primitives
✅ **Color Customization** - Change sofa color with picker and swatches  
✅ **Dimension Controls** - Adjust width, height, depth with sliders
✅ **Real-time Updates** - See changes instantly in 3D
✅ **Modern UI** - Clean interface with Tailwind CSS
✅ **Reset Functionality** - Restore default settings
✅ **Configuration Saving** - Save your custom designs

## 🚀 Running the App

The development server should be starting automatically. If not:

```bash
npm start
```

Then open: http://localhost:3000

## 🎮 How to Use

1. **Change Colors**: Use the color picker or click color swatches
2. **Adjust Size**: Move the sliders for width, height, depth
3. **3D Controls**: 
   - Drag to rotate the sofa
   - Scroll to zoom in/out
   - Right-click and drag to pan
4. **Save**: Click "Save Configuration" to store your design
5. **Reset**: Click "Reset to Default" to start over

## 🔄 Adding Your Own 3D Model

To replace the geometric sofa with your own GLB model:

1. Place your `.glb` file in the `public` folder
2. Update `src/components/SofaScene.tsx` line 15:
   ```typescript
   const { scene } = useGLTF('/your-sofa-model.glb');
   ```
3. Replace the `SofaModel` function with the GLB loader version

## 📁 Project Structure

```
src/
├── components/
│   ├── SofaScene.tsx      # 3D scene and sofa rendering
│   └── ControlPanel.tsx   # Color and dimension controls
├── App.tsx               # Main application
└── index.css             # Tailwind styles
```

## 🎨 Current Features

- **3D Visualization**: Interactive sofa with shadows and lighting
- **Color System**: 12 predefined colors + custom color picker
- **Dimension Scaling**: Real-time size adjustments
- **Performance**: Optimized rendering with React Three Fiber
- **Responsive**: Works on desktop and mobile
- **TypeScript**: Full type safety

## 🔧 Next Steps

- Add your own 3D sofa model
- Connect to backend API
- Add texture options
- Implement sofa style variations
- Add pricing calculations

---

**The sofa is now rendering! 🎉** Check your browser at http://localhost:3000
