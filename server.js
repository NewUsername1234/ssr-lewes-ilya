const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const products = require('./models/Products');
require('dotenv').config();

const app = express();
const port = process.env.PORT || '3333';

/* connect to db */
(async () => {
	try {
		await mongoose.connect(process.env.MONGODB_URI, {
			useUnifiedTopology: true,
			useNewUrlParser: true,
			useCreateIndex: true,
		});
		console.log('database is connected');

		app.listen(port, () =>
			console.log(`server is running: http://localhost:${port}`)
		);
	} catch (e) {
		console.log('An error occurred: ', e);
		process.exit(1);
	}
})();



/* set view engine and public files */
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

/* state */
const state = {
	loggedIn: false,
};

/* routes */
app.get('/', (req, res) => {
	res.status(200).render('home', { loggedIn: state.loggedIn });
});
/* app.get('/products', (req, res) => {
    const products =
	res.status(200).render('products', { loggedIn: state.loggedIn, products });
}); */

app.get('/products', async (req, res) => {
    try {
        res.status(200).render( 'products', { loggedIn: state.loggedIn, products: await products.readAll() } )
    }
    catch (e) { res.status(404).render('error', { loggedIn: state.loggedIn, response: 'Can not serve all the products: ' + e.message}) }
})

app.get('/about', (req, res) => {
	res.status(200).render('about', { loggedIn: state.loggedIn });
});
app.get('/login', (req, res) => {
	res.status(200).render('login', { loggedIn: state.loggedIn });
});
app.post('/login', (req, res) => {
	state.loggedIn = !state.loggedIn;
	res.status(200).send();
});
