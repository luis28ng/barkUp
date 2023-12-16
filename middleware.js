import express from 'express';
const app = express();


// If user is not logged in, they cannot add a review
app.get('/addReview/:id', (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('login');
    } else {
        next();
    }
});

// If the id does not belong to the user or the user is not an admin, they cannot edit a review
app.get('reviews/:id', (req, res, next) => {
    if (req.method === 'PUT') {
        console.log('Editing review')
        if (req.user.role !== 'admin') {
            res.redirect('welcome', {});
        } else {
            next();
        }
    }
});

// If user is not logged in, they cannot add a review
app.get('reviews/addReview/:id', (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('login');
    } else {
        next();
    }
});

// If user is not logged in , they cannot add a review
app.get('/editReview/:id', (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('login');
    } else {
        next();
    }
});

// If user is not an admin, they will not have access to admin panel
app.get('/admin', (req, res, next) => {
    if (req.session.user && req.session.user.role === 'admin') {
        next();
    } else {
        return res.redirect('welcome');
    }
});

// If user is not an admin, they will not have access to admin panel
app.get('/admin/park/:id', (req, res, next) => {
    if (req.session.user && req.session.user.role === 'admin') {
        next();
    } else {
        return res.redirect('welcome');
    }
});

// If user is not an admin, they will not have access to admin panel
app.get('/admin/store/:id', (req, res, next) => {
    if (req.session.user && req.session.user.role === 'admin') {
        next();
    } else {
        return res.redirect('welcome');
    }
});

// If user is not an admin, they will not have access to admin routes
app.get('/admin/editPark/:id', (req, res, next) => {
    if (req.session.user && req.session.user.role === 'admin') {
        next();
    } else {
        return res.redirect('welcome');
    }
});

// If user is not an admin, they will not have access to admin routes
app.get('/admin/editStore/:id', (req, res, next) => {
    if (req.session.user && req.session.user.role === 'admin') {
        next();
    } else {
        return res.redirect('welcome');
    }
});

// If user is not an admin, they will not have access to admin routes
app.get('/admin/addPark', (req, res, next) => {
    if (req.session.user && req.session.user.role === 'admin') {
        next();
    } else {
        return res.redirect('welcome');
    }
});

// If user is not an admin, they will not have access to admin routes
app.get('/admin/addStore', (req, res, next) => {
    if (req.session.user && req.session.user.role === 'admin') {
        next();
    } else {
        return res.redirect('welcome');
    }
});

// If user is not an admin, they will not have access to admin routes
app.get('/admin/deleteReview/:id', (req, res, next) => {
    if (req.session.user && req.session.user.role === 'admin') {
        next();
    } else {
        return res.redirect('welcome');
    }
});

// If user is not an admin, they will not have access to admin routes
app.get('/admin/deleteStore/:id', (req, res, next) => {
    if (req.session.user && req.session.user.role === 'admin') {
        next();
    } else {
        return res.redirect('welcome');
    }
});

// If user is not an admin, they will not have access to admin routes
app.get('/admin/deletePark/:id', (req, res, next) => {
    if (req.session.user && req.session.user.role === 'admin') {
        next();
    } else {
        return res.redirect('welcome');
    }
});

// If user is not logged in, they should not have access to a profile
app.get('/profile', (req, res, next) => {
    console.log(req.session.user);
    if (!req.session.user) {
        return res.redirect('login');
    } else {
        next();
    }
});

// If a user is logged in, they will not have access to the login page
app.get('/login', (req, res, next) => {
    if (req.session.user && req.session.user.role === 'admin') {
        return res.redirect('admin_panel');
    } else if (req.session.user && req.session.user.role === 'user') {
        return res.redirect('welcome')
    } else {
        next();
    }
});

// If a user is logged in, they will not have access to the register page
app.get('/register', (req, res, next) => {
    if (req.session.user && req.session.user.role === 'admin') {
        return res.redirect('admin_panel');
    } else if (req.session.user && req.session.user.role === 'user') {
        return res.redirect('welcome')
    } else {
        next();
    }
});


