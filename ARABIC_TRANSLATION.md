# 🌍 Arabic Translation & RTL Support

This document describes the Arabic translation and RTL (Right-to-Left) support implementation for the Sofa Customizer application.

## ✅ Features Implemented

### 1. **Translation System**
- ✅ Complete Arabic translation files (`src/locales/ar.json`)
- ✅ English translation files (`src/locales/en.json`)
- ✅ React Context-based translation system (`src/contexts/LanguageContext.jsx`)
- ✅ Dynamic language switching with persistence
- ✅ Parameter interpolation support

### 2. **RTL Layout Support**
- ✅ Comprehensive RTL CSS rules in `src/index.css`
- ✅ Automatic direction switching based on language
- ✅ RTL-specific spacing, margins, and padding adjustments
- ✅ RTL grid and flexbox improvements
- ✅ RTL form controls and input styling
- ✅ RTL shadows, borders, and positioning

### 3. **Arabic Font Support**
- ✅ Noto Sans Arabic font integration
- ✅ Fallback fonts for better compatibility
- ✅ Proper Arabic text rendering

### 4. **Language Switcher**
- ✅ Dropdown language selector component
- ✅ Visual language indicators
- ✅ Smooth language transitions

## 🚀 How to Use

### Switching Languages
1. Use the language switcher in the top-right corner
2. Select between العربية (Arabic) and English
3. The interface will automatically switch to RTL/LTR mode

### Adding New Translations
1. Add new keys to both `src/locales/ar.json` and `src/locales/en.json`
2. Use the `t()` function in components: `t('your.key')`
3. For parameters: `t('your.key', { param: value })`

### RTL-Specific Styling
The CSS automatically handles RTL layout. For custom RTL styles:
```css
[dir='rtl'] .your-class {
  /* RTL-specific styles */
}
```

## 📁 File Structure

```
src/
├── locales/
│   ├── ar.json          # Arabic translations
│   └── en.json          # English translations
├── contexts/
│   └── LanguageContext.jsx  # Translation context
├── components/
│   └── LanguageSwitcher.jsx # Language selector
└── index.css            # RTL CSS rules
```

## 🎨 RTL Features

### Automatic Adjustments
- **Text Direction**: Right-to-left text alignment
- **Spacing**: Reversed margins and padding
- **Flexbox**: Reversed flex directions
- **Grid**: RTL-aware grid layouts
- **Forms**: Right-aligned form controls
- **Shadows**: Mirrored shadow directions
- **Animations**: RTL-aware slide animations

### Color Variables
All colors use CSS custom properties for consistency:
```css
var(--ant-color-primary)    /* Primary blue */
var(--ant-color-success)    /* Success green */
var(--ant-color-warning)    /* Warning orange */
var(--ant-color-error)      /* Error red */
```

## 🔧 Technical Details

### Translation Context
```jsx
const { t, language, isRTL, changeLanguage } = useTranslation();
```

### RTL Detection
```jsx
const isRTL = language === 'ar';
```

### Language Persistence
- Languages are saved to localStorage
- Browser language detection on first visit
- Defaults to Arabic (ar)

## 🌟 Benefits

1. **Full Arabic Support**: Complete interface in Arabic
2. **Proper RTL Layout**: Natural right-to-left reading experience
3. **Seamless Switching**: Instant language changes
4. **Accessibility**: Proper semantic HTML with lang attributes
5. **Performance**: Efficient CSS with minimal overhead
6. **Maintainable**: Clean separation of translations and styles

## 🎯 Usage Examples

### Basic Translation
```jsx
<h1>{t('app.title')}</h1>
// Arabic: "مخصص الأرائك"
// English: "Sofa Customizer"
```

### Translation with Parameters
```jsx
<p>{t('welcome.message', { name: 'أحمد' })}</p>
// Arabic: "مرحباً أحمد"
// English: "Welcome Ahmed"
```

### RTL-Aware Components
```jsx
<div className="flex space-x-3">
  {/* Automatically becomes space-x-reverse in RTL */}
</div>
```

## 🔮 Future Enhancements

- [ ] More language support (French, Spanish, etc.)
- [ ] Date/time localization
- [ ] Number formatting for Arabic numerals
- [ ] Currency formatting
- [ ] Advanced RTL animations
- [ ] Voice-over support for accessibility

---

**Note**: The application now fully supports Arabic with proper RTL layout. All text, controls, and layouts automatically adapt to the selected language direction.
