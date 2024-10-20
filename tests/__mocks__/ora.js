// tests/__mocks__/ora.js
const ora = {
  start: (text) => {
    console.log(`Starting: ${text}`);
    return {
      succeed: (text) => console.log(`Success: ${text}`),
      fail: (text) => console.log(`Failed: ${text}`),
      stop: () => console.log('Stopped'),
      text: (newText) => console.log(`Text updated: ${newText}`)
    };
  }
};

module.exports = ora;
