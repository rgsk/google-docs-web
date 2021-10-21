import user from '../api/user.api';

class User {
  data;
  callbackWhenUserChanges;
  constructor(data, callbackWhenUserChanges) {
    this.data = data;
    this.callbackWhenUserChanges = callbackWhenUserChanges;
  }
  async updateEmail(newEmail) {
    const previousEmail = this.data.email;
    const result = await user.updateEmail(previousEmail, newEmail);
    // console.log(result);
    if (result.error) {
      throw result.error;
    }
    this.callbackWhenUserChanges(
      new User({ ...this.data, email: newEmail }, this.callbackWhenUserChanges)
    );
    return result;
  }
  async updatePassword(newPassword) {
    const result = await user.updatePassword(this.data.email, newPassword);
    // console.log(result);
    if (result.error) {
      throw result.error;
    }
    return result;
  }
  get email() {
    return this.data.email;
  }
}
export default User;
