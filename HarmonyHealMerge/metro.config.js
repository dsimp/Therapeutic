const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Disable package exports to prevent Metro from fetching the ES Module builds of three.js 
// that contain `import.meta` syntax, forcing it to fall back to the CommonJS build instead.
config.resolver.unstable_enablePackageExports = false;
config.resolver.enablePackageExports = false;

// Add support for 3D model files
config.resolver.assetExts.push('glb', 'gltf', 'bin');

module.exports = config;
