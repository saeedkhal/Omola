# Sample Sofa Model Instructions

## Adding Your Own 3D Sofa Model

1. **Prepare Your Model**:
   - Export your sofa model as `.glb` format (recommended) or `.gltf`
   - Ensure the model is centered at origin (0,0,0)
   - Use reasonable scale (1-3 units in your 3D software)
   - Apply materials with proper naming

2. **Place the Model**:
   - Copy your `.glb` file to the `public` folder
   - Rename it to `sofa.glb` or update the path in `SofaScene.js`

3. **Update the Code**:
   ```javascript
   // In src/components/SofaScene.js, line 15:
   const { scene } = useGLTF('/your-sofa-model.glb');
   ```

## Model Requirements

### Materials
- Use `MeshStandardMaterial` or `MeshPhongMaterial`
- Name materials consistently (e.g., "sofa_fabric", "sofa_legs")
- Apply UV mapping for textures

### Scale
- Default scale: 1 unit = 1 meter
- Adjust dimensions in the app (0.5x to 3x scale)

### Performance
- Keep polygon count reasonable (< 50k triangles)
- Use texture compression
- Consider LOD (Level of Detail) for complex models

## Testing Without a Model

If you don't have a 3D model yet, you can:

1. **Use a placeholder**: The app will show a loading spinner
2. **Create a simple box**: Export a basic cube as GLB
3. **Download a sample**: Use free models from sites like Sketchfab

## Free Model Resources

- [Sketchfab](https://sketchfab.com) - Free 3D models
- [Poly Haven](https://polyhaven.com) - High-quality free assets
- [Blender](https://www.blender.org) - Free 3D modeling software

## Troubleshooting Model Issues

### Model Not Loading
- Check file path in `useGLTF`
- Ensure file is in `public` folder
- Verify GLB/GLTF format

### Colors Not Changing
- Check material types in your 3D software
- Ensure materials are `Standard` or `Phong` type
- Verify material naming

### Performance Issues
- Reduce polygon count
- Compress textures
- Use Draco compression in export settings
