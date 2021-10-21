import localStore from '../helpers/localStore';
import User from '../models/User.model';
const auth = {
  callbackWhenUserChanges: () => {},
  checkUserLocally: () => {
    localStore.setUser(auth.callbackWhenUserChanges);
  },
  createUserWithEmailAndPassword: async (email, password) => {
    const result = await fetch('http://localhost:4000/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
      }),
      headers: {
        'content-type': 'application/json',
      },
    }).then((res) => res.json());
    // console.log(result);

    if (result.error) {
      throw result.error;
    }
    localStore.addAll({ ...result, email }, auth.callbackWhenUserChanges);
    return result;
  },
  signInWithEmailAndPassword: async (email, password) => {
    const result = await fetch('http://localhost:4000/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
      }),
      headers: {
        'content-type': 'application/json',
      },
    }).then((res) => res.json());
    // console.log(result);
    if (result.error) {
      throw result.error;
    }
    localStore.addAll({ ...result, email }, auth.callbackWhenUserChanges);

    return result;
  },
  signOut: () => {
    localStore.removeAll(auth.callbackWhenUserChanges);
  },
  onAuthStateChanged: (callback) => {
    auth.callbackWhenUserChanges = callback;
    return () => {
      auth.callbackWhenUserChanges = () => {};
    };
  },
};
export default auth;
