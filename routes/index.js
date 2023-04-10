import express from 'express'
import { loginController, logoutController, refreshController, registerController, userController } from '../controllers'
import productController from '../controllers/productController'
import admin from '../middlewares/admin'
import auth from '../middlewares/auth'
const router = express.Router()

router.post('/register', registerController.register)
router.post('/login', loginController.login)
router.get('/me', auth, userController.me)
router.post('/refresh', refreshController.refresh)
router.post('/logout', auth, logoutController.logout)
router.post('/products', [auth, admin], productController.store);
router.put('/products/:id', [auth, admin],productController.update);
router.delete('/products/:id', [auth, admin], productController.destroy);
router.get('/products', productController.index)
router.get('/products/:id', productController.show);

export default router