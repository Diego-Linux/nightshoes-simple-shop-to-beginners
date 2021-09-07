export const isUser = (req, res, next) => {
    (req.session.userId) ? next() : res.redirect('/login');
}

export const notUser = (req, res, next) => {
    (!req.session.userId) ? next() : res.redirect('/');
}

export const isAdmin = (req, res, next) => {
    (req.session.isAdmin) ? next() : res.redirect('/');
}



