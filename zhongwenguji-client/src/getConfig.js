const stage = process.env.STAGE || 'development';

const baseConfig = {
  getCharacterSampleUrl: 'http://localhost:3001/getCharacterSample',
  submitTestUrl: 'http://localhost:3001/submitTest'
};

const config = Object.assign({}, baseConfig, {
  production: {
    getCharacterSampleUrl: 'https://4xfh4cpvgd.execute-api.ap-southeast-2.amazonaws.com/dev/getCharacterSample',
    submitTestUrl: 'https://4xfh4cpvgd.execute-api.ap-southeast-2.amazonaws.com/dev/submitTest'
  }
}[stage]);

export default () => config;
