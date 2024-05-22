const express = require('express');
const router = express.Router();
const checkoutController = require('../controllers/checkoutController');
router.get('/getCheckoutSessions', checkoutController.getCheckoutSessions);
router.post('/checkout', checkoutController.checkout);
router.get('/sendInvoice', checkoutController.sendInvoice);
router.get('/getInvoices', checkoutController.getInvoices);

router.post('/webhook',checkoutController.Webhook)
module.exports = router;
