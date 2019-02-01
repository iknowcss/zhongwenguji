import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import 'jest-localstorage-mock';
import fetchMock from 'jest-fetch-mock';

configure({ adapter: new Adapter() });
global.fetch = fetchMock;
