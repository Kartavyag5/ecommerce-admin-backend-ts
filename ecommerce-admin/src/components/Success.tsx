import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import API from "../api/axios";

const SuccessPage = () => {

  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  
  useEffect(() => {
    const fetchSession = async () => {
      const res = await API.get(`/orders/get-checkout-session?session_id=${sessionId}`);
      // console.log('Stripe session:', res.data);
    };
    if (sessionId) fetchSession();
  }, [sessionId]);


  return (
    <div className="success-page">
      <h1>Payment Successful!</h1>
      <p>Thank you for your purchase. Your order has been processed successfully.</p>
      <p>You will receive a confirmation email shortly.</p>
    </div>
  );
}
   
export default SuccessPage;