const config = Object.assign({
  // Base config
  getCharacterSampleUrl: 'http://localhost:3001/getCharacterSample',
  submitTestUrl: 'http://localhost:3001/submitTest',
  skritterCharactersUrl: 'http://localhost:3001/skritter/characters',
  feedbackPrefillUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSe74g0vXWUuVsQ9uqYGQhLFADOeqiUHfyyjBqT4AfdY4VOYxg/viewform?usp=pp_url&entry.1889314490=',
  skritterCallbackUrl: 'https://legacy.skritter.com/api/v0/oauth2/authorize?response_type=code&client_id=hanzishanapp'
}, {
  local: {
    enableReduxDevTools: true
  },
  staging: {
    getCharacterSampleUrl: 'https://n822oyux32.execute-api.ap-southeast-2.amazonaws.com/staging/getCharacterSample',
    submitTestUrl: 'https://n822oyux32.execute-api.ap-southeast-2.amazonaws.com/staging/submitTest'
  },
  production: {
    getCharacterSampleUrl: 'https://shwhby0nv7.execute-api.ap-southeast-2.amazonaws.com/production/getCharacterSample',
    submitTestUrl: 'https://shwhby0nv7.execute-api.ap-southeast-2.amazonaws.com/production/submitTest',
    enableGA: true
  }
}[process.env.REACT_APP_STAGE || 'local']);

export default () => config;
