import passport from 'passport';
//import { usersRepository } from './dao/Mongo/manager/users.dao.js';

import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GithubStrategy } from 'passport-github2';
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';
import { hashData , compareData } from './config/utils.js';
import config from './config/config.js';
import UserResDTO from './DTOs/userResponse.dto.js';
import UserReqDTO from './DTOs/userRequest.dto.js';
import { cartsRepository } from './repositories/cart.repository.js';
import { usersRepository } from './repositories/users.repository.js';
// signup
passport.use('signup', new LocalStrategy({ passReqToCallback: true, usernameField: 'email' },
  async (req, email, password, done) => {
    const userReqDTO = new UserReqDTO(req.body);

    if (!userReqDTO.Usuario || !password || !email) {
      return done(null, false);
    }

    try {
      const hashedPassword = await hashData(password);
      const newCart = await cartsRepository.createCart();

      if (email === config.admin_email && password === config.admin_password) {
        const createdAdmin = await usersRepository.createOne({
          ...userReqDTO,
          password: hashedPassword,
          role: 'Admin',
          cartId: newCart._id
        });
        return done(null, createdAdmin);
      }

      const createdUser = await usersRepository.createOne({
        ...userReqDTO,
        password: hashedPassword,
        cartId: newCart._id
      });

      return done(null, createdUser);
    } catch (error) {
      done(error);
    }
  }
));

// login
passport.use('login', new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
  if (!email || !password) {
    return done(null, false);
  }
  try {
    const user = await usersRepository.findByEmail(email);
    if (!user) {
      return done(null, false);
    }
    const isPasswordValid = await compareData(password, user.password);
    if (!isPasswordValid) {
      return done(null, false);
    }

    const userResDTO = new UserResDTO(user);
    return done(null, userResDTO);
  } catch (error) {
    done(error);
  }
}));

//Github 
passport.use('github', new GithubStrategy({
    clientID: config.git_client_id,
    clientSecret: config.git_client_secret,
    callbackURL: "http://localhost:8080/api/sessions/callback",
},async(accessToken,refreshToken,profile,done)=>{
    try {

        const userDB = await usersRepository.findByEmail(profile._json.email) 

        const newCart = await cartsRepository.createCart();

        //login
        if (userDB){
        if(userDB.isGithub){
        return done (null, userDB)
        }else{
            done(error);
            return done(null,false)
        }
    }
    //signup 
    const infoUser={
        Usuario:profile._json.name,
        email: profile._json.email ,
        password: ' ',
        isGithub:true,
        cartId: newCart._id
    }
    const createUser = await usersRepository.createOne(infoUser)
    
    return done ( null, createUser)
    } catch (error) {
        done(error)
    }
}))

//JWT 
const fromCookies =(req)=>{return req.cookies.token}

passport.use('jwt', new JwtStrategy 
({jwtFromRequest: ExtractJwt.fromExtractors([fromCookies])
//({jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
    ,secretOrKey:config.secret_jwt},async function(jwt_payload,done) {
    done(null, jwt_payload)
})
)

passport.serializeUser((user,done) =>{
    done(null,user._id)
})

passport.deserializeUser(async(id,done) =>{
try {
    const user = await usersRepository.findById(id);
    done (null,user)
} catch (error) {
    done(error)
}
})


