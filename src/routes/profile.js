import loadable from 'react-loadable';

const Profile = loadable({
  loader: () =>
    import(/* webpackChuckName: 'profile-route'*/
    '../screens/profile'),
  loading: 'loading',
  timeout: 10000,
});

export default Profile;
