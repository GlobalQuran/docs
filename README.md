# GlobalQuran.com - Documentation & Download Portal

![GlobalQuran Logo](public/logo-alternate.png)

The official documentation and download portal for GlobalQuran.com - providing free access to Quran data, translations, audio recitations, and development resources.

**🌐 Live Site:** [https://docs.globalquran.com](https://docs.globalquran.com)

## 📖 About GlobalQuran.com

GlobalQuran.com is an open-source project dedicated to making the Holy Quran accessible to everyone through technology. We provide comprehensive APIs, downloadable datasets, and development resources for building Quran-related applications.

## 🎯 What This Repository Provides

### 📚 Interactive API Documentation
- Complete OpenAPI specification with live examples
- Interactive "Try it out" functionality
- Code samples in multiple programming languages
- Real-time API testing environment

### 💾 Data Downloads
- **Text Formats**: Quran translations in 100+ languages
- **Audio Recitations**: High-quality MP3/OGG files from renowned recitors
- **Multiple Formats**: JSON, JSONP, TXT, and XML
- **Bulk Downloads**: ZIP packages for offline use

### 🎨 Assets & Resources
- **Quran Fonts**: Arabic fonts optimized for Quranic text
- **Ayah Images**: 6,236 individual verse images in high resolution
- **Development Tools**: SDKs and helper libraries

### 🔧 Developer Examples
- **Basic Examples**: Simple API usage patterns
- **Advanced Examples**: Complex integration scenarios
- **Source Code**: Full HTML/JavaScript implementations
- **Live Demos**: Working examples with real data

## 🚀 Features

### 🌍 Comprehensive Coverage
- **6,236 Verses**: Complete Quran text
- **100+ Languages**: Translations and transliterations
- **50+ Recitors**: Audio recitations in various styles
- **Multiple Formats**: Text, audio, and image resources

### 🔄 Real-time API Access
- **RESTful API**: Clean, documented endpoints
- **JSONP Support**: Cross-origin requests
- **Rate Limiting**: Fair usage policies
- **High Availability**: 99.9% uptime

### 📱 Developer-Friendly
- **Interactive Examples**: Side-by-side code and demos
- **Copy-Paste Ready**: Working code snippets
- **Multiple Languages**: Examples in JavaScript, Python, PHP, etc.
- **Comprehensive Docs**: Detailed API reference

## 🛠️ Available Resources

### Text Data
- **Quran Original**: Arabic text in multiple scripts
- **Translations**: English, Urdu, French, Spanish, and 100+ more
- **Transliterations**: Romanized Arabic text
- **Metadata**: Surah names, verse counts, revelation info

### Audio Data
- **Recitors**: Abdul Basit, Mishary Rashid, Saad Al-Ghamdi, and more
- **Quality Options**: 32kbps to 192kbps
- **Formats**: MP3 and OGG
- **Individual Verses**: 6,236 separate audio files per recitor

### Visual Assets
- **Fonts**: Specialized Arabic fonts for Quranic text
- **Images**: High-resolution verse images
- **Icons**: UI elements for Islamic applications
- **Logos**: GlobalQuran.com branding assets

## 📋 API Endpoints

### Core Endpoints
- `/quran` - List all available resources
- `/complete/{translation}` - Full Quran text
- `/surah/{number}/{translation}` - Specific chapter
- `/ayah/{surah}/{ayah}/{translation}` - Individual verse
- `/juz/{number}/{translation}` - Quran by Juz (Para)
- `/page/{number}/{translation}` - Quran by page

### Audio Endpoints
- `/audio/{recitor}/{verse}.mp3` - Individual verse audio
- `/recitors` - List available recitors
- `/formats` - Available audio formats

## 🎓 Getting Started

### 1. Explore the Documentation
Visit [docs.globalquran.com](https://docs.globalquran.com) to:
- Browse the interactive API documentation
- Try live examples with real data
- Download sample code and resources

### 2. Basic API Usage
```javascript
// Fetch list of available translations
fetch('https://api.globalquran.com/quran')
  .then(response => response.json())
  .then(data => console.log(data.quranList));

// Get a specific verse
fetch('https://api.globalquran.com/ayah/1/1/en.sahih')
  .then(response => response.json())
  .then(data => console.log(data.verse));
```

### 3. Download Resources
- **Text Data**: Use the download portal to get ZIP packages
- **Audio Files**: Bulk download recitations by recitor
- **Assets**: Get fonts and images for your applications

## 🤝 Contributing

We welcome contributions to improve the documentation and add new features:

1. **Report Issues**: [GitHub Issues](https://github.com/GlobalQuran/site/issues)
2. **Submit PRs**: Help improve documentation and examples
3. **Suggest Features**: Request new API endpoints or resources
4. **Translate**: Help add more language translations

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🔗 Links

- **Main Website**: [GlobalQuran.com](https://globalquran.com)
- **API Documentation**: [docs.globalquran.com](https://docs.globalquran.com)
- **GitHub Repository**: [github.com/GlobalQuran/site](https://github.com/GlobalQuran/site)
- **Blog**: [blog.globalquran.com](https://blog.globalquran.com)
- **Contact**: [Contact Us](https://blog.globalquran.com/contact-us/)

## 💝 Support

If you find this project useful, please consider:
- ⭐ Starring the repository
- 🐛 Reporting bugs and issues
- 💡 Suggesting new features
- 🤝 Contributing code or documentation
- 💰 [Making a donation](https://globalquran.com/donate/)

---

**Made with ❤️ for the global Muslim community**

*"And We have certainly made the Quran easy for remembrance, so is there any who will remember?" - Quran 54:17*
