
 export default class UserReqDTO {
    constructor(user) {
      this.name = `${user.first_name} ${user.last_name}`;
      this.email = user.email;
      this.Usuario = user.Usuario;
      this.password = user.password;
      this.isGithub = user.isGithub || false;
      this.role = user.role || 'User';
      this.age = user.age;
      this.order=[]
        }
  }

  
  

  