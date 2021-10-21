import User from '../models/User.model';
const localStore = {
  removeAll: (callbackWhenUserChanges) => {
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('email');

    callbackWhenUserChanges(null);
  },
  addAll: (keyValues, callbackWhenUserChanges) => {
    for (let key in keyValues) {
      localStorage.setItem(key, keyValues[key]);
    }
    callbackWhenUserChanges(new User(keyValues, callbackWhenUserChanges));
  },
  setUser: (callbackWhenUserChanges) => {
    const data = {};
    data.email = localStorage.getItem('email');
    if (!data.email) return;
    data.refreshToken = localStorage.getItem('refreshToken');
    data.accessToken = localStorage.getItem('accessToken');
    // console.log(data);
    callbackWhenUserChanges(new User(data, callbackWhenUserChanges));
  },
};
export default localStore;
