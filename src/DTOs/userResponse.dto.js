export default class UserResDTO {
    constructor(user) {
      this.name = user.name
      this.Usuario = user.Usuario;
      this.isGithub = user.isGithub;
      this.cartId = user.cartId;
      this.email = user.email;
      this.role = user.role;
      this.orders = user.orders;
    }
  }
  