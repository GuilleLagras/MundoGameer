import { Router } from 'express';
import passport from 'passport'
import { usersController } from '../controllers/users.controller.js';

const sessionRouter = Router()
;
//Local
sessionRouter.post('/signup', (req, res, next) => usersController.signup(req, res, next));
sessionRouter.post('/login', (req, res, next) => usersController.login(req, res, next));
sessionRouter.post('/restore', async (req, res) => usersController.restorePassword(req, res));

// GitHub 
sessionRouter.get('/auth/github', (req, res) => usersController.githubAuth(req, res));
sessionRouter.get('/callback', passport.authenticate('github', { session: false }), (req, res) => usersController.githubCallback(req, res));

// Current 
sessionRouter.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => usersController.getCurrentUser(req, res));
//Signout
sessionRouter.get('/signout', (req, res) => usersController.signout(req, res));
export default sessionRouter;

