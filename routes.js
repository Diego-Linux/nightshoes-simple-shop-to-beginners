import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import {
    getRegister, postRegister,
    getLogin, postLogin, addToCart,
    getCart, deleteCart, subQuantity
} from './controllers/UserCtrl';
import {
    getProducts, postProducts,
    getDetails, getAddProducts
} from './controllers/ProductCtrl';

import { isUser, notUser, isAdmin } from './middleware/Middleware';

const router = Router();
const upload = multer(multerConfig);

router.get('/', getProducts);

router.get('/products/:id', getDetails);

router.post('/subquantity', subQuantity);

router.get('/cart', getCart);

router.post('/addcart', isUser, addToCart);

router.post('/cart/delete', deleteCart);

router.get('/register', notUser, getRegister);

router.post('/register', notUser,postRegister);

router.get('/login', notUser, getLogin);

router.post('/login', notUser, postLogin);

router.post('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
})

router.get('/add', isAdmin, getAddProducts);

router.post('/add', isAdmin, upload.single("image"), postProducts);

export default router;