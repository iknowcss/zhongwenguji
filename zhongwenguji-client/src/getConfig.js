const config = Object.assign({
  // Base config
  getCharacterSampleUrl: 'http://localhost:3001/getCharacterSample',
  submitTestUrl: 'http://localhost:3001/submitTest'
}, {
  // Stage overrides
  production: {
    getCharacterSampleUrl: 'https://4xfh4cpvgd.execute-api.ap-southeast-2.amazonaws.com/dev/getCharacterSample',
    submitTestUrl: 'https://4xfh4cpvgd.execute-api.ap-southeast-2.amazonaws.com/dev/submitTest'
  }
}[process.env.REACT_APP_STAGE]);

export default () => config;
