import loadable from 'react-loadable';

const HomePage = loadable({
  loader: () =>
    import(/* webpackChuckName: 'homepage-route'*/
    '../screens/homepage'),
  loading: 'loading',
  timeout: 10000,
});

export default HomePage;
