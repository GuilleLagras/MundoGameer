
import passport from 'passport';
import { usersService } from '../services/users.service.js';
import { generateToken, hashData } from '../config/utils.js';
import UserResDTO from '../DTOs/userResponse.dto.js'

class UsersController {
  async signup(req, res, next) {
    passport.authenticate('signup', (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.redirect('/error');
      }
      res.redirect('/login');
    })(req, res, next);
  }

  async login(req, res, next) {
    passport.authenticate('login', async (err, user, info) => {
      if (err || !user) {
        return res.redirect('/error');
      }
      req.login(user, { session: false }, async (error) => {
        if (error) {
          return next(error);
        }

        const { Usuario, email, role, cartId } = user;
        const token = generateToken({ Usuario, email, role, cartId });

        res.cookie('token', token, { maxAge: 60000, httpOnly: true });
        res.redirect('/api/products');
      });
    })(req, res, next);
  }

  async signout(req, res) {
    res.clearCookie('token');
    res.redirect('/login');
  }

  async restorePassword(req, res) {
    const { email, password } = req.body;
    try {
      const user = await usersService.findByEmail(email);
      if (!user) {
        return res.redirect('/signup');
      }

      const hashedPassword = await hashData(password);
      user.password = hashedPassword;
      await user.save();

      res.status(200).json({ message: 'Password Actualizada' });
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
  }

  async githubCallback(req, res) {
    try {
      const { Usuario, email, role, cartId } = req.user;
      const token = generateToken({ Usuario, email, role, cartId });
      res.cookie('token', token, { maxAge: 60000, httpOnly: true });
      res.redirect('/api/products');
    } catch (error) {
      res.redirect('/error');
    }
  }

  async githubAuth(req, res) {
    passport.authenticate('github', {
      scope: ['user:email', 'read:user'],
      session: false,
    })(req, res);
  }

  async getCurrentUser(req, res) {
    try {
    const userResponseDTO = new UserResDTO(req.user);
    const userEmail = req.user.email; 
      res.json({ user: userResponseDTO, email: userEmail });
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
  }
}

export const usersController = new UsersController();
