import React, { useState, useCallback, Suspense, useEffect } from 'react';
import SofaScene, { LoadingSpinner } from './components/SofaScene';
import ControlPanel from './components/ControlPanel';
import LanguageSwitcher from './components/LanguageSwitcher';
import { useTranslation } from './contexts/LanguageContext';
import { Sofa, Heart, Code, Facebook, Instagram, Youtube, MapPin, Link as LinkIcon } from 'lucide-react';

// Default configuration
const DEFAULT_CONFIG = {
  color: '#F4A460', // Sandy Brown
  dimensions: {
    width: 2.0,
    height: 0.8,
    depth: 0.9
  }
};

function App() {
  const { t } = useTranslation();
  
  // Parse URL parameters on initial load
  const getInitialState = useCallback(() => {
    const params = new URLSearchParams(window.location.search);
    
    return {
      color: params.get('color') || DEFAULT_CONFIG.color,
      height: parseFloat(params.get('height')) || DEFAULT_CONFIG.dimensions.height,
      depth: parseFloat(params.get('depth')) || DEFAULT_CONFIG.dimensions.depth,
      wallCount: parseInt(params.get('wallCount')) || 3,
      wallWidths: params.get('wallWidths') 
        ? params.get('wallWidths').split(',').map(w => parseFloat(w))
        : [2.0, 1.5, 1.8],
      fabricType: params.get('fabricType') || 'cotton'
    };
  }, []);

  const initialState = getInitialState();
  
  const [color, setColor] = useState(initialState.color);
  const [dimensions, setDimensions] = useState({
    width: 2.0, // Not used anymore, kept for compatibility
    height: initialState.height,
    depth: initialState.depth
  });
  const [wallCount, setWallCount] = useState(initialState.wallCount);
  const [wallWidths, setWallWidths] = useState(initialState.wallWidths);
  const [fabricType, setFabricType] = useState(initialState.fabricType);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [savedConfigurations, setSavedConfigurations] = useState([]);

  // Update URL with current configuration
  const updateURL = useCallback((params) => {
    const searchParams = new URLSearchParams(window.location.search);
    
    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined) {
        searchParams.set(key, params[key]);
      }
    });
    
    const newURL = `${window.location.pathname}?${searchParams.toString()}`;
    window.history.replaceState({}, '', newURL);
  }, []);

  // Sync state to URL whenever it changes
  useEffect(() => {
    updateURL({
      color: color,
      height: dimensions.height.toFixed(1),
      depth: dimensions.depth.toFixed(1),
      wallCount: wallCount,
      wallWidths: wallWidths.map(w => w.toFixed(1)).join(','),
      fabricType: fabricType
    });
  }, [color, dimensions.height, dimensions.depth, wallCount, wallWidths, fabricType, updateURL]);

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
    // Limit to maximum 3 walls
    const limitedCount = Math.min(count, 3);
    setWallCount(limitedCount);
    setWallWidths(prev => {
      const newWidths = Array.from({ length: limitedCount }, (_, i) => prev[i] || 2.0);
      return newWidths;
    });
  }, []);

  // Handle individual wall width change
  const handleWallWidthChange = useCallback((index, width) => {
    setWallWidths(prev => prev.map((w, i) => i === index ? width : w));
  }, []);

  // Handle fabric type change
  const handleFabricChange = useCallback((fabric) => {
    setFabricType(fabric);
  }, []);

  // Reset to default configuration
  const handleReset = useCallback(() => {
    setColor(DEFAULT_CONFIG.color);
    setDimensions(DEFAULT_CONFIG.dimensions);
    setWallCount(3);
    setWallWidths([2.0, 1.5, 1.8]);
    setFabricType('cotton');
    
    // Clear URL parameters
    window.history.replaceState({}, '', window.location.pathname);
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
          <div className="flex items-center justify-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3 justify-center">
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
            </div>
          </div>

          {/* Control Panel */}
          <div className="lg:col-span-1">
            <ControlPanel
              color={color}
              dimensions={dimensions}
              wallCount={wallCount}
              wallWidths={wallWidths}
              fabricType={fabricType}
              onColorChange={handleColorChange}
              onDimensionChange={handleDimensionChange}
              onWallCountChange={handleWallCountChange}
              onWallWidthChange={handleWallWidthChange}
              onFabricChange={handleFabricChange}
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
                      <div>{t('controls.width')}: {config.dimensions.width.toFixed(1)} {t('controls.unit')}</div>
                      <div>{t('controls.height')}: {config.dimensions.height.toFixed(1)} {t('controls.unit')}</div>
                      <div>{t('controls.depth')}: {config.dimensions.depth.toFixed(1)} {t('controls.unit')}</div>
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
          <div className="text-center">
            {/* Social Media Links */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                {t('app.followUs') || 'تابعنا على السوشيال ميديا'}
              </h3>
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <a
                  href="https://www.facebook.com/3mola2?mibextid=kFxxJD"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Facebook size={20} />
                  <span>Facebook</span>
                </a>
                <a
                  href="https://www.instagram.com/3mol.a3003/?utm_source=qr&igsh=MW5jaTRmd3pvNHNkMQ%3D%3D"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
                >
                  <Instagram size={20} />
                  <span>Instagram</span>
                </a>
                <a
                  href="https://www.tiktok.com/@mollomoll?_t=8sj49epn3c6&_r=1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
                  </svg>
                  <span>TikTok</span>
                </a>
                <a
                  href="https://www.youtube.com/channel/UC8x2Qypa1LJMx3MWdB5c1BA?si=JjEfZfYbLic04kTr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <Youtube size={20} />
                  <span>YouTube</span>
                </a>
                <a
                  href="https://pin.it/4NbjsA0Pk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800 transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0a12 12 0 00-4.37 23.17c.06-1.08.12-2.75-.03-3.94-.13-1.08-0.85-3.6-0.85-3.6s-.22-.43-.22-1.07c0-1 .58-1.75 1.3-1.75.62 0 .91.46.91 1.02 0 .62-.4 1.55-.6 2.41-.17.72.36 1.3 1.07 1.3 1.29 0 2.28-1.36 2.28-3.32 0-1.74-1.25-2.95-3.03-2.95-2.07 0-3.28 1.55-3.28 3.15 0 .62.24 1.29.54 1.66.06.07.07.13.05.2l-.2.82c-.03.13-.11.16-.25.09-0.9-.42-1.47-1.74-1.47-2.8 0-2.28 1.66-4.38 4.78-4.38 2.51 0 4.46 1.79 4.46 4.18 0 2.5-1.57 4.51-3.75 4.51-.73 0-1.42-.38-1.66-.83l-.45 1.72c-.16.63-.6 1.42-0.9 1.9a12 12 0 1011.11-16.96z"/>
                  </svg>
                  <span>Pinterest</span>
                </a>
                <a
                  href="https://www.google.com/maps/place/30.034513,31.113102"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <MapPin size={20} />
                  <span>{t('app.location') || 'موقعنا'}</span>
                </a>
                <a
                  href="https://linktr.ee/abdoomola"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <LinkIcon size={20} />
                  <span>Linktree</span>
                </a>
              </div>
            </div>

            {/* Copyright */}
            <div className="text-gray-600 border-t border-gray-200 pt-6">
              <p className="flex items-center justify-center gap-2">
                {t('app.builtWith')} <Heart size={16} className="text-red-500" />
              </p>
              <p className="mt-2 text-sm">
                © 2025 Omola Furniture - {t('app.allRightsReserved') || 'جميع الحقوق محفوظة'}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
