import { Router } from "express";
import __dirname from '../config/utils.js';

//auth
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { jwtValidator } from "../middlewares/jwt.middleware.js";

import { cartsService } from "../services/cart.service.js";
import { messageRepository } from "../repositories/message.repository.js";
import { cartsRepository } from "../repositories/cart.repository.js";
import { productRepository } from "../repositories/products.repository.js";
import { transport } from "../config/nodemailer.js";

const adminAuthMiddleware = ['Admin']
const userAuthMiddleware = ['Admin', 'User']

const viewsRouter = Router();
viewsRouter.get('/', async (req, res) => {
  try {
    const limit = 12;

    const { result } = await productRepository.findAllCustom({
      limit: limit,
    });

    const productObject = result.map(doc => doc.toObject());

   

    res.render('home', {
      productList: productObject
    });

  } catch (error) {
    res.status(500).json({ error: 'Error al cargar la vista.' });
  }
});

viewsRouter.get('/realtimeproducts',jwtValidator, authMiddleware(adminAuthMiddleware), async (req, res) => {
  try {
    const limit = 100; 

    const { result } = await productRepository.findAllCustom({
      limit: limit, 
    });
    const productObject = result.map(doc => doc.toObject());
    res.render('realTimeProducts', {
      productList: productObject,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al cargar la vista.' });
  }
});

//agregar SOLO USUARIO ENTRA AL CHAT 
viewsRouter.get('/chat',jwtValidator,authMiddleware(userAuthMiddleware), async (req, res) => {
  try {
    const {email:userEmail}= req.user
    const messages = await messageRepository.getAllMessages();
    res.render('chat', { messages , userEmail });
  } catch (error) {
    console,log(error)
    res.redirect('/login')}
});

viewsRouter.get('/api/products',jwtValidator,authMiddleware(userAuthMiddleware), async (req, res) => {
  try {
    const { info, result } = await productRepository.findAllCustom(req.query);

  const productObject = result.map(doc => doc.toObject());
  const { cartId } = req.user;
  const { cartLenght } = await cartsRepository.findCartById(cartId);
 res.render('products', {
      productList: productObject,
      user: req.user,
      cartLenght,
      pagination: {
        prevLink: info.prevLink,
        nextLink: info.nextLink,
    },
    });
  } catch (error) {
    res.redirect('/login')
  }
});


viewsRouter.get('/api/product/:pid', jwtValidator,authMiddleware(userAuthMiddleware), async (req, res) => {
  try {
      const pid = req.params.pid;
      const { cartId } = req.user;

      const product = await productRepository.findById(pid);

      if (!product) {
          return res.status(404).json({ error: 'Producto no encontrado.' });
      }

      res.render('productView', { product, cartId });
  } catch (error) {
    res.redirect('/login')
      }
});


viewsRouter.get('/api/cart/:cid', async (req, res) => {
  try {
    const idCart = req.params.cid;
    const {cart , total} = await cartsRepository.findCartById(idCart); 
    res.render('cart', { cart ,total ,idCart});
   } catch (error) {

    res.status(500).send('Error al renderizar la página de carrito');
  }
});

// viewsRouter
viewsRouter.get('/signup', async (req, res) => {
if (req.authenticated) {
      return res.redirect('/api/products');
  }
  res.render('signup', { user: req.user });
});

viewsRouter.get('/login', async (req, res) => {
  if (req.authenticated) {
      return res.redirect('/api/products');
  }

 res.render('login', { user: req.user });
});

//purchase
viewsRouter.get("/:idCart/purchase", jwtValidator, async (req, res) => {
  try {
    const { idCart } = req.params;
    const { email: userEmail } = req.user;

    const response = await cartsService.purchase(idCart, userEmail, req.user);

    if (response.success) {
      res.render('purchased', {
        message: response.message,
        availableProducts: response.availableProducts,
        total: response.total,
        unavailableProducts: response.unavailableProducts,
      });
    } else {
      res.render('purchaseFailed', {
        message: response.message,
        unavailableProducts: response.unavailableProducts,
      });
    }

    console.log('purchased', response);

    const mailOptions = {
      from: 'Noi Lagras',
      to: userEmail,
      subject: 'Prueba de email - coderBackend',
      text: `Productos comprados: ${response.availableProducts}\nProductos sin stock: ${response.unavailableProducts}`
    };

    await transport.sendMail(mailOptions);
    console.log('Correo electrónico enviado');

  } catch (error) {
    console.error('Error en la ruta de compra', error);
    res.redirect('/login');
  }
});




viewsRouter.get('/restore', async (req, res) => {
  
 res.render('restore')
});
viewsRouter.get('/error', async (req, res) => {
  
  res.render('error')
 });
export default viewsRouter;