const config = Object.assign({
  // Base config
  getCharacterSampleUrl: 'http://localhost:3001/getCharacterSample',
  submitTestUrl: 'http://localhost:3001/submitTest',
  feedbackPrefillUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSemOEF67ARiyZirKh5qB4e9Uj3roNyaVf0XzrIjIeG44UIkbg/viewform?usp=pp_url&entry.1889314490='
}, {
  // Stage overrides
  staging: {
    getCharacterSampleUrl: 'https://n822oyux32.execute-api.ap-southeast-2.amazonaws.com/staging/getCharacterSample',
    submitTestUrl: 'https://n822oyux32.execute-api.ap-southeast-2.amazonaws.com/staging/submitTest'
  },
  production: {
    getCharacterSampleUrl: 'https://shwhby0nv7.execute-api.ap-southeast-2.amazonaws.com/production/getCharacterSample',
    submitTestUrl: 'https://shwhby0nv7.execute-api.ap-southeast-2.amazonaws.com/production/submitTest',
    enableGA: true
  }
}[process.env.REACT_APP_STAGE]);

export default () => config;
