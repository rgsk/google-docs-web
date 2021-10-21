const user = {
  updateEmail: async (previousEmail, newEmail) => {
    return await fetch('http://localhost:4000/user', {
      method: 'PATCH',
      body: JSON.stringify({
        previousEmail,
        email: newEmail,
        updateEmail: true,
      }),
      headers: {
        'content-type': 'application/json',
      },
    }).then((res) => res.json());
  },
  updatePassword: async (email, newPassword) => {
    return await fetch('http://localhost:4000/user', {
      method: 'PATCH',
      body: JSON.stringify({
        email,
        password: newPassword,
        updatePassword: true,
      }),
      headers: {
        'content-type': 'application/json',
      },
    }).then((res) => res.json());
  },
};
export default user;
