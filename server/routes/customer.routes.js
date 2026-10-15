const express = require('express');
const router = express.Router();
const {
  registerCustomer,
  loginCustomer,
  getMyProfile,
  logoutCustomer,
  changePassword,
} = require('../controllers/customer.controller');
const { protectRoute } = require('../middlewares/auth.middleware');

router.post('/register', registerCustomer);
router.post('/login', loginCustomer);

router.get('/me', protectRoute, getMyProfile);
router.post('/logout', protectRoute, logoutCustomer);
router.patch('/change-password', protectRoute, changePassword);

module.exports = router;
