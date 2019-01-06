const config = Object.assign({
  // Base config
  getCharacterSampleUrl: 'http://localhost:3001/getCharacterSample',
  submitTestUrl: 'http://localhost:3001/submitTest',
  feedbackPrefillUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSemOEF67ARiyZirKh5qB4e9Uj3roNyaVf0XzrIjIeG44UIkbg/viewform?usp=pp_url&entry.1889314490='
}, {
  // Stage overrides
  production: {
    getCharacterSampleUrl: 'https://4xfh4cpvgd.execute-api.ap-southeast-2.amazonaws.com/dev/getCharacterSample',
    submitTestUrl: 'https://4xfh4cpvgd.execute-api.ap-southeast-2.amazonaws.com/dev/submitTest',
    feedbackPrefillUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSemOEF67ARiyZirKh5qB4e9Uj3roNyaVf0XzrIjIeG44UIkbg/viewform?usp=pp_url&entry.1889314490='
  }
}[process.env.REACT_APP_STAGE]);

export default () => config;
