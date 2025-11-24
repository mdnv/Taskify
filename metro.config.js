/**
 * Basic Metro config for Expo projects. This uses Expo's default Metro config
 * which handles React Native and React Native Web out of the box for SDK 50+.
 */
const { getDefaultConfig } = require('@expo/metro-config');

module.exports = getDefaultConfig(__dirname);
