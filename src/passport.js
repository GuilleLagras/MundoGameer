import passport from 'passport';

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
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Check if the user exists in the database by email
    const existingUser = await usersRepository.findByEmail(profile._json.email);

    if (existingUser) {
      if (existingUser.isGithub) {
        return done(null, existingUser); // Authenticated user
      } else {
        // Existing user, but not authenticated with GitHub
        return done(null, false, { message: 'User registered with another authentication method.' });
      }
    }

    // User not found in the database, create a new user with GitHub
    const newUserDetails = {
      username: profile._json.name,
      email: profile._json.email,
      password: null, // No password for GitHub-authenticated users
      isGithub: true,
      cartId: newCart._id
    };

    const newUser = await usersRepository.createOne(newUserDetails);
    return done(null, newUser); // Newly authenticated user

  } catch (error) {
    console.error('Error in GitHub authentication:', error);
    return done(error); // Handle errors appropriately
  }
}));



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


