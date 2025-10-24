import React, { useState, useCallback } from 'react';
import { useTranslation } from '../contexts/LanguageContext';

// Color Swatch Component
function ColorSwatch({ color, isSelected, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`w-12 h-12 rounded-full border-4 transition-all duration-200 hover:scale-110 ${
        isSelected ? 'border-white shadow-lg' : 'border-gray-300'
      }`}
      style={{ backgroundColor: color }}
      title={color}
    />
  );
}

// Dimension Control Component
function DimensionControl({ label, value, min, max, step, onChange, unit = 'm' }: any) {
  const { t } = useTranslation();
  
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label} ({unit})
      </label>
      <div className="flex items-center space-x-3">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
        />
        <input
          type="number"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
    </div>
  );
}

// Main Control Panel Component
function ControlPanel({ 
  color, 
  dimensions,
  wallCount,
  wallWidths,
  onColorChange, 
  onDimensionChange,
  onWallCountChange,
  onWallWidthChange,
  onReset,
  onSaveConfiguration 
}: any) {
  const { t } = useTranslation();
  const [customColor, setCustomColor] = useState(color);

  // Predefined color swatches
  const colorSwatches = [
    '#8B4513', // Saddle Brown
    '#D2691E', // Chocolate
    '#CD853F', // Peru
    '#A0522D', // Sienna
    '#F4A460', // Sandy Brown
    '#DEB887', // Burlywood
    '#D2B48C', // Tan
    '#BC8F8F', // Rosy Brown
    '#2F4F4F', // Dark Slate Gray
    '#696969', // Dim Gray
    '#000000', // Black
    '#FFFFFF', // White
  ];

  const handleCustomColorChange = useCallback((e: any) => {
    const newColor = e.target.value;
    setCustomColor(newColor);
    onColorChange(newColor);
  }, [onColorChange]);

  const handleSwatchClick = useCallback((swatchColor: string) => {
    setCustomColor(swatchColor);
    onColorChange(swatchColor);
  }, [onColorChange]);

  const handleSave = useCallback(() => {
    const configuration = {
      color: customColor,
      dimensions: dimensions,
      timestamp: new Date().toISOString()
    };
    onSaveConfiguration(configuration);
  }, [customColor, dimensions, onSaveConfiguration]);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('controls.title')}</h2>
      
      {/* Color Selection */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700">{t('controls.chooseColor')}</h3>
        
        {/* Custom Color Picker */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            {t('controls.customColor')}
          </label>
          <div className="flex items-center space-x-3">
            <input
              type="color"
              value={customColor}
              onChange={handleCustomColorChange}
              className="w-12 h-12 border border-gray-300 rounded cursor-pointer"
            />
            <input
              type="text"
              value={customColor}
              onChange={handleCustomColorChange}
              className="flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="#000000"
            />
          </div>
        </div>

        {/* Predefined Swatches */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            {t('controls.popularColors')}
          </label>
          <div className="grid grid-cols-6 gap-2">
            {colorSwatches.map((swatchColor) => (
              <ColorSwatch
                key={swatchColor}
                color={swatchColor}
                isSelected={customColor === swatchColor}
                onClick={() => handleSwatchClick(swatchColor)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Wall Configuration */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700">{t('controls.wallConfiguration') || 'Wall Configuration'}</h3>
        
        {/* Number of Walls */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            {t('controls.numberOfWalls') || 'Number of Walls'}
          </label>
          <div className="flex items-center space-x-3">
            <input
              type="range"
              min={1}
              max={3}
              step={1}
              value={wallCount}
              onChange={(e) => onWallCountChange(parseInt(e.target.value))}
              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <input
              type="number"
              min={1}
              max={3}
              step={1}
              value={wallCount}
              onChange={(e) => onWallCountChange(parseInt(e.target.value))}
              className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Individual Wall Widths */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            {t('controls.wallWidths') || 'Wall Widths'}
          </label>
          {wallWidths.map((width: number, index: number) => (
            <DimensionControl
              key={index}
              label={`${t('controls.wall') || 'Wall'} ${index + 1}`}
              value={width}
              min={0.5}
              max={5.0}
              step={0.1}
              onChange={(value: number) => onWallWidthChange(index, value)}
            />
          ))}
        </div>
      </div>

      {/* Shared Dimension Controls */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700">{t('controls.sharedDimensions') || 'Shared Dimensions'}</h3>
        
        <DimensionControl
          label={t('controls.height')}
          value={dimensions.height}
          min={0.5}
          max={2.0}
          step={0.1}
          onChange={(value: number) => onDimensionChange('height', value)}
        />
        
        <DimensionControl
          label={t('controls.depth')}
          value={dimensions.depth}
          min={0.5}
          max={2.5}
          step={0.1}
          onChange={(value: number) => onDimensionChange('depth', value)}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3 pt-4 border-t border-gray-200">
        <button
          onClick={onReset}
          className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200 font-medium"
        >
          {t('controls.resetToDefault')}
        </button>
        <button
          onClick={handleSave}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
        >
          {t('controls.saveConfiguration')}
        </button>
      </div>

      {/* Current Configuration Display */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">{t('controls.currentConfiguration')}</h4>
        <div className="text-sm text-gray-600 space-y-1">
          <div>{t('controls.color')}: <span className="font-mono">{customColor}</span></div>
          <div>{t('controls.walls') || 'Walls'}: {wallCount}</div>
          {wallWidths.map((width: number, index: number) => (
            <div key={index} className="pl-4">
              {t('controls.wall') || 'Wall'} {index + 1}: {width.toFixed(1)}m
            </div>
          ))}
          <div>{t('controls.height')}: {dimensions.height.toFixed(1)}m</div>
          <div>{t('controls.depth')}: {dimensions.depth.toFixed(1)}m</div>
        </div>
      </div>
    </div>
  );
}

export default ControlPanel;
