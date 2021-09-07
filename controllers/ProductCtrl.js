import Product from '../models/Product';

export const getProducts = async (req, res) => {
    let categories = ["Masculino", "Feminino",];

    const category = req.query.category;

    let products;

    category && categories.includes(category)
        ? products = await Product.find({ category })
        : products = await Product.find({})

    res.render('home', {
        products,
        isUser: req.session.userId,
        isAdmin: req.session.isAdmin,
        pageTitle: 'Products'
    })
};

export const getAddProducts = async (req, res) => {
    res.render('add', {
        isUser: req.session.userId,
        isAdmin: req.session.isAdmin,
        pageTitle: 'Adicionar Produto'
    });
};

export const postProducts = async (req, res) => {
    try {
        req.body.image = req.file.filename;

        const product = new Product(req.body);

        await product.save();
        res.redirect('/')
    } catch (err) {
        console.log(err);
    }
}

export const getDetails = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        res.render('details', {
            product,
            isUser: req.session.userId,
            isAdmin: req.session.isAdmin,
            pageTitle: 'Detalhes do Produto'
        })
    } catch (err) {
        res.redirect('/')
    }
}