const Razorpay = require('razorpay');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

module.exports = async (req, res) => {
  // Allow CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { amount, plan } = req.body;

    if (!amount || !plan) {
      return res.status(400).json({ error: 'amount and plan are required' });
    }

    const order = await razorpay.orders.create({
      amount: amount * 100,        // Razorpay needs paise (₹10 → 1000)
      currency: 'INR',
      receipt: 'rcpt_' + Date.now(),
      notes: { plan },
    });

    res.status(200).json(order);
  } catch (err) {
    console.error('Razorpay order error:', err);
    res.status(500).json({ error: 'Failed to create order' });
  }
};
