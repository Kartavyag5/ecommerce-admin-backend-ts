import { Request, Response } from 'express';

const stripe = require('stripe')('sk_test_51J8L2bSBLK7PNVunUxH2yM7BKNbOhYOJ5Xcr5DMz7k5VaJxqcgVTFqWvQ92hz24rFrsjgS7q8vVLZ4zQnhYy8C8M00iaEQGVsQ');

export const createCheckoutSession = async (req: Request, res: Response) => {
    try{
        const {products} = req.body;
    
    const lineItems = products.map((product: any) => ({
        price_data: {
            currency: 'inr',
            product_data: { name: product.product.name },
            unit_amount: product.product.price * 100,
        },
        quantity: product.quantity,
}));
     
    const session =  await stripe.checkout.sessions.create({
        line_items: lineItems,
        payment_method_types: ['card'],
        mode: 'payment',
        success_url: `http://localhost:5173/payment-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `http://localhost:5173/payment-fail?session_id={CHECKOUT_SESSION_ID}`,
    })

    res.json({ id: session.id });
    }catch(error) {
        res.json({ error: error });   
    }
    
}

export const getCheckoutSession = async (req: any, res: any) => {
  const { session_id } = req.query;
  console.log('session_id: ', session_id);
  try {
    const session = await stripe.checkout.sessions.retrieve(session_id as string);
    res.json(session);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};
    