// app.config.js
export default ({ config }) => {
  return {
    ...config,
    android: undefined, // bỏ các trường này nếu không dùng prebuild
    ios: undefined,
    icon: undefined,
    splash: undefined,
    // ...
  };
};
