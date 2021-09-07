import Cart from '../models/Cart';
import User from '../models/User';

export const getRegister = (req, res) => {
    res.render('register', {
        userErr: req.flash('userErr')[0],
        isUser: false,
        isAdmin: false,
        pageTitle: 'Crie uma conta'
    })
};

export const postRegister = async (req, res) => {
    try {
        const { email, name, password, cpassword } = req.body;

        const user = await User.findOne({ email });

        if (user) {
            throw new Error('Dados Inválidos')
        }
        if (email.length === 0 || name.length === 0) {
            throw new Error('Preencha todos os campos corretamente')
        }

        if (password.length < 6 || cpassword !== password) {
            throw new Error('Preencha os campos de senha corretamente')
        }
        await User.create({ email, name, password });

        res.redirect('/login');
    } catch (err) {
        req.flash('userErr', err.message);
        res.redirect('/register');
    }
}

export const getLogin = async (req, res) => {
    res.render('login', {
        userErr: req.flash('userErr')[0],
        isUser: false,
        isAdmin: false,
        pageTitle: 'Acessar Conta'
    })
}

export const postLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (email.length === 0 || password.length === 0) {
            throw new Error('Preencha todos os campos corretamente')
        }

        if (!user) {
            throw new Error('Dados inválidos')
        }

        const checkPassword = user.comparePassword(password);

        if (!checkPassword) {
            throw new Error('Dados inválidos')
        }

        req.session.userId = user._id;
        req.session.isAdmin = user.isAdmin;

        console.log(user._id)

        res.redirect('/');

    } catch (err) {
        req.flash('userErr', err.message);
        res.redirect('/login');
    }
}

export const addToCart = async (req, res) => {
    try {
        const {
            name, price,
            productId, image,
            size, category
        } = req.body;

        let checkProduct = await Cart.findOne({ productId: productId })

        if (checkProduct) {
            await Cart.findOneAndUpdate({ productId: productId }, {
                $inc: { quantity: 1 }
            })
            res.redirect('/cart');
        }
        else {
            const cartProduct = new Cart({
                name, price,
                productId, image,
                size, category,
                userId: req.session.userId,
            });
            await cartProduct.save();
            res.redirect('/cart');
        }
    } catch (err) {
        console.log(err);
    }
};

export const subQuantity = async (req, res) => {
    const { cartId, productId } = req.body;
    let checkCart = await Cart.findOne({ productId: productId });
    if (checkCart.quantity > 1) {
        await Cart.findOneAndUpdate({ productId: productId }, {
            $inc: { quantity: -1 }
        })
        res.redirect('/cart');
    } else {
        await Cart.findByIdAndDelete(cartId);
        res.redirect('/cart');
    }
}

export const getCart = async (req, res) => {
    let userId = req.session.userId;

    let products = await Cart.find({ userId });

    res.render('cart', {
        products,
        isUser: true,
        isAdmin: req.session.isAdmin,
        pageTitle: 'Carrinho'
    })
};

export const deleteCart = async (req, res) => {
    try {
        const { cartId } = req.body;

        await Cart.findByIdAndDelete(cartId);
        res.redirect('/cart');
    } catch (err) {
        console.log(err);
    }
}
