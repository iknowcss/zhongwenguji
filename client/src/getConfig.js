const LAMBDA_BASE_URL = {
  LOCAL: 'http://localhost:3001',
  STAGING: 'https://n822oyux32.execute-api.ap-southeast-2.amazonaws.com/staging',
  PRODUCTION: 'https://shwhby0nv7.execute-api.ap-southeast-2.amazonaws.com/production'
};

const config = Object.assign({
  // Base config
  getCharacterSampleUrl: `${LAMBDA_BASE_URL.LOCAL}/getBinSamples`,
  submitTestUrl: `${LAMBDA_BASE_URL.LOCAL}/submitTest`,
  feedbackPrefillUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSfRvmf2MkcTImXByka0zlHPmaPlQ1tmeepeWC-yPKLoylHIKQ/viewform?usp=pp_url&entry.1889314490=',
}, {
  local: {
    enableReduxDevTools: true
  },
  staging: {
    getCharacterSampleUrl: `${LAMBDA_BASE_URL.STAGING}/getBinSamples`,
    submitTestUrl: `${LAMBDA_BASE_URL.STAGING}/submitTest`,
    skritterContextUrl: `${LAMBDA_BASE_URL.STAGING}/skritter/oauth/token`,
    skritterCharactersUrl: `${LAMBDA_BASE_URL.STAGING}/skritter/characters`
  },
  production: {
    getCharacterSampleUrl: `${LAMBDA_BASE_URL.PRODUCTION}/getBinSamples`,
    submitTestUrl: `${LAMBDA_BASE_URL.PRODUCTION}/submitTest`,
    skritterContextUrl: `${LAMBDA_BASE_URL.PRODUCTION}/skritter/oauth/token`,
    enableGA: true
  }
}[process.env.REACT_APP_STAGE || 'local']);

export default () => config;
