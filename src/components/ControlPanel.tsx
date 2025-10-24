import React, { useState, useCallback } from 'react';
import { useTranslation } from '../contexts/LanguageContext';
import { Send } from 'lucide-react';
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
function DimensionControl({ label, value, min, max, step, onChange }: any) {
  const { t } = useTranslation();
  
  // Convert meters to centimeters for display
  const displayValue = Math.round(value * 100);
  const displayMin = Math.round(min * 100);
  const displayMax = Math.round(max * 100);
  const displayStep = Math.round(step * 100);
  
  const handleChange = (cmValue: number) => {
    // Convert centimeters back to meters for internal state
    onChange(cmValue / 100);
  };
  
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label} ({t('controls.unit')})
      </label>
      <div className="flex items-center space-x-3">
        <input
          type="range"
          min={displayMin}
          max={displayMax}
          step={displayStep}
          value={displayValue}
          onChange={(e) => handleChange(parseFloat(e.target.value))}
          className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
        />
        <input
          type="number"
          min={displayMin}
          max={displayMax}
          step={displayStep}
          value={displayValue}
          onChange={(e) => handleChange(parseFloat(e.target.value))}
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
  fabricType,
  onColorChange, 
  onDimensionChange,
  onWallCountChange,
  onWallWidthChange,
  onFabricChange,
}: any) {
  const { t } = useTranslation();
  const [customColor, setCustomColor] = useState(color);
  const WHATSAPP_NUMBER = '+201010023300';

  // Fabric options
  const fabricOptions = [
    { value: 'cotton', label: t('controls.cotton') },
    { value: 'linen', label: t('controls.linen') },
    { value: 'naturalSilk', label: t('controls.naturalSilk') },
    { value: 'velvet', label: t('controls.velvet') },
    { value: 'suede', label: t('controls.suede') },
    { value: 'naturalLeather', label: t('controls.naturalLeather') },
    { value: 'syntheticLeather', label: t('controls.syntheticLeather') },
    { value: 'satin', label: t('controls.satin') },
    { value: 'chenille', label: t('controls.chenille') },
    { value: 'mixedFabrics', label: t('controls.mixedFabrics') },
  ];

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

  const handleSendWhatsApp = useCallback(() => {
    // Get current URL with all parameters
    const currentURL = window.location.href;
    
    // Calculate total price
    const totalWidth = wallWidths.reduce((sum: number, width: number) => sum + Math.round(width * 100), 0);
    const totalPrice = totalWidth * 5;
    
    // Get fabric label
    const fabricLabel = fabricOptions.find((f: any) => f.value === fabricType)?.label || fabricType;
    
    // Create a message with configuration details (convert to cm)
    const message = `${t('controls.whatsappMessage') || 'Check out my sofa configuration'}:
    
${t('controls.color')}: ${customColor}
${t('controls.fabricType')}: ${fabricLabel}
${t('controls.walls')}: ${wallCount}
${wallWidths.map((width: number, index: number) => `${t(`controls.wall${index + 1}`) || `${t('controls.wall')} ${index + 1}`}: ${Math.round(width * 100)}${t('controls.unit') || 'cm'}`).join('\n')}
${t('controls.height')}: ${Math.round(dimensions.height * 100)}${t('controls.unit') || 'cm'}
${t('controls.depth')}: ${Math.round(dimensions.depth * 100)}${t('controls.unit') || 'cm'}

${t('controls.totalPrice') || 'Total Price'}: ${totalPrice.toLocaleString()} ${t('controls.egp') || 'EGP'}

${t('controls.viewConfiguration') || 'View Configuration'}: ${currentURL}`;
    
    // Encode message for WhatsApp URL
    const encodedMessage = encodeURIComponent(message);
    
    // Create WhatsApp URL
    const whatsappURL = `https://wa.me/${WHATSAPP_NUMBER.replace(/\+/g, '')}?text=${encodedMessage}`;
    
    // Open WhatsApp in a new window
    window.open(whatsappURL, '_blank');
  }, [customColor, dimensions, wallCount, wallWidths, fabricType, fabricOptions, t, WHATSAPP_NUMBER]);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('controls.title')}</h2>
      
      {/* Fabric Type Selection */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700">{t('controls.fabricType')}</h3>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            {t('controls.selectFabric')}
          </label>
          <select
            value={fabricType}
            onChange={(e) => onFabricChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {fabricOptions.map((fabric: any) => (
              <option key={fabric.value} value={fabric.value}>
                {fabric.label}
              </option>
            ))}
          </select>
        </div>
      </div>

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
              label={t(`controls.wall${index + 1}`) || `${t('controls.wall')} ${index + 1}`}
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

      {/* Action Button */}
      <div className="pt-4 border-t border-gray-200">
        <button
          onClick={handleSendWhatsApp}
          className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium flex items-center justify-center gap-2"
        >
         <Send size={20} />
          {t('controls.sendViaWhatsApp') || 'Send via WhatsApp'}
        </button>
      </div>

      {/* Current Configuration Display */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">{t('controls.currentConfiguration')}</h4>
        <div className="text-sm text-gray-600 space-y-1">
          <div className='flex items-center gap-2'>{t('controls.color')}: <div className="font-mono w-6 h-6 rounded-full" style={{ backgroundColor: customColor }}></div></div>
          <div>{t('controls.fabricType')}: {fabricOptions.find((f: any) => f.value === fabricType)?.label || fabricType}</div>
          <div>{t('controls.walls') || 'Walls'}: {wallCount}</div>
          {wallWidths.map((width: number, index: number) => (
            <div key={index} className="pl-4">
              {t(`controls.wall${index + 1}`) || `${t('controls.wall')} ${index + 1}`}: {Math.round(width * 100)}{t('controls.unit') || 'cm'}
            </div>
          ))}
          <div>{t('controls.height')}: {Math.round(dimensions.height * 100)}{t('controls.unit') || 'cm'}</div>
          <div>{t('controls.depth')}: {Math.round(dimensions.depth * 100)}{t('controls.unit') || 'cm'}</div>
          
          {/* Price Calculation */}
          <div className="pt-3 mt-3 border-t border-gray-300">
            <div className="font-semibold text-green-700 text-base">
              {t('controls.totalPrice') || 'Total Price'}: {(wallWidths.reduce((sum: number, width: number) => sum + Math.round(width * 100), 0) * 5).toLocaleString()} {t('controls.egp') || 'EGP'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ControlPanel;
