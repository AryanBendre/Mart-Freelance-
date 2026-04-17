import { Router } from 'express';
import Razorpay from 'razorpay';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// Initialize Razorpay with dummy keys if not provided
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_dummy_key',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_secret',
});

router.post('/create-order', authenticateToken, async (req, res) => {
  try {
    const { amount } = req.body; // amount in INR

    const options = {
      amount: amount * 100, // amount in smallest currency unit (paise)
      currency: 'INR',
      receipt: `receipt_order_${Date.now()}`,
    };

    // If using dummy keys, we just mock the response
    if (process.env.RAZORPAY_KEY_ID === undefined) {
      return res.json({
        id: `order_mock_${Date.now()}`,
        amount: options.amount,
        currency: 'INR'
      });
    }

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Payment order creation failed' });
  }
});

router.post('/verify', authenticateToken, async (req, res) => {
  try {
    // In a real app, verify the signature using crypto
    // const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    
    // For this demo, we assume verification is successful
    res.json({ status: 'success', message: 'Payment verified successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Payment verification failed' });
  }
});

export default router;
