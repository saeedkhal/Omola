import React, { useState, useCallback, Suspense } from 'react';
import SofaScene, { LoadingSpinner } from './components/SofaScene';
import ControlPanel from './components/ControlPanel';
import LanguageSwitcher from './components/LanguageSwitcher';
import { useTranslation } from './contexts/LanguageContext';
import { Sofa, Heart, Code } from 'lucide-react';

// Default configuration
const DEFAULT_CONFIG = {
  color: '#8B4513', // Saddle Brown
  dimensions: {
    width: 2.0,
    height: 0.8,
    depth: 0.9
  }
};

function App() {
  const { t } = useTranslation();
  const [color, setColor] = useState(DEFAULT_CONFIG.color);
  const [dimensions, setDimensions] = useState(DEFAULT_CONFIG.dimensions);
  const [wallCount, setWallCount] = useState(2);
  const [wallWidths, setWallWidths] = useState([2.0, 1.5]);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [savedConfigurations, setSavedConfigurations] = useState([]);

  // Handle color changes
  const handleColorChange = useCallback((newColor) => {
    setColor(newColor);
  }, []);

  // Handle dimension changes
  const handleDimensionChange = useCallback((dimension, value) => {
    setDimensions(prev => ({
      ...prev,
      [dimension]: value
    }));
  }, []);

  // Handle wall count change
  const handleWallCountChange = useCallback((count) => {
    setWallCount(count);
    setWallWidths(prev => {
      const newWidths = Array.from({ length: count }, (_, i) => prev[i] || 2.0);
      return newWidths;
    });
  }, []);

  // Handle individual wall width change
  const handleWallWidthChange = useCallback((index, width) => {
    setWallWidths(prev => prev.map((w, i) => i === index ? width : w));
  }, []);

  // Reset to default configuration
  const handleReset = useCallback(() => {
    setColor(DEFAULT_CONFIG.color);
    setDimensions(DEFAULT_CONFIG.dimensions);
    setWallCount(2);
    setWallWidths([2.0, 1.5]);
  }, []);

  // Handle model load
  const handleModelLoad = useCallback((model) => {
    setModelLoaded(true);
    console.log('3D Model loaded successfully:', model);
  }, []);

  // Save configuration (for backend integration)
  const handleSaveConfiguration = useCallback((configuration) => {
    // For now, save to local state
    const newConfig = {
      ...configuration,
      id: Date.now().toString()
    };
    setSavedConfigurations(prev => [...prev, newConfig]);
    
    // Here you would typically send to your backend
    console.log('Saving configuration to backend:', newConfig);
    
    // Example API call (uncomment when you have a backend):
    /*
    fetch('/api/configurations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newConfig)
    })
    .then(response => response.json())
    .then(data => {
      console.log('Configuration saved:', data);
      // Show success message to user
    })
    .catch(error => {
      console.error('Error saving configuration:', error);
      // Show error message to user
    });
    */
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Sofa size={32} className="text-primary" />
                {t('app.title')}
              </h1>
              <p className="text-gray-600 mt-1">
                {t('app.subtitle')}
              </p>
            </div>
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 3D Viewer */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="h-96 lg:h-[600px] relative">
                {!modelLoaded && (
                  <div className="absolute inset-0 z-10">
                    <LoadingSpinner />
                  </div>
                )}
                <Suspense fallback={<LoadingSpinner />}>
                  <SofaScene
                    color={color}
                    dimensions={dimensions}
                    wallWidths={wallWidths}
                    onModelLoad={handleModelLoad}
                  />
                </Suspense>
              </div>
              <div className="p-4 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">{t('app.status')}:</span> {modelLoaded ? t('app.modelLoaded') : t('app.loading')}
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">{t('app.controls')}:</span> {t('app.controlsDescription')}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Control Panel */}
          <div className="lg:col-span-1">
            <ControlPanel
              color={color}
              dimensions={dimensions}
              wallCount={wallCount}
              wallWidths={wallWidths}
              onColorChange={handleColorChange}
              onDimensionChange={handleDimensionChange}
              onWallCountChange={handleWallCountChange}
              onWallWidthChange={handleWallWidthChange}
              onReset={handleReset}
              onSaveConfiguration={handleSaveConfiguration}
            />
          </div>
        </div>

        {/* Saved Configurations */}
        {savedConfigurations.length > 0 && (
          <div className="mt-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                {t('controls.savedConfigurations')}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {savedConfigurations.map((config) => (
                  <div key={config.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center space-x-3 mb-2">
                      <div
                        className="w-6 h-6 rounded-full border border-gray-300"
                        style={{ backgroundColor: config.color }}
                      />
                      <span className="text-sm font-medium text-gray-700">
                        {t('controls.configuration')} #{config.id.slice(-4)}
                      </span>
                    </div>
                    <div className="text-xs text-gray-600 space-y-1">
                      <div>{t('controls.width')}: {config.dimensions.width.toFixed(1)}m</div>
                      <div>{t('controls.height')}: {config.dimensions.height.toFixed(1)}m</div>
                      <div>{t('controls.depth')}: {config.dimensions.depth.toFixed(1)}m</div>
                      <div className="text-gray-400">
                        {new Date(config.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p className="flex items-center justify-center gap-2">
              {t('app.builtWith')} <Heart size={16} className="text-red-500" />
            </p>
            <p className="mt-2 text-sm flex items-center justify-center gap-2">
              <Code size={16} />
              {t('app.readyForBackend')}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
