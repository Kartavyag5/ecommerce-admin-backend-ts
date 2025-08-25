import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import API from "../api/axios";


const FailPage = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  
  useEffect(() => {
    if (sessionId) fetchSession();
  }, [sessionId]);

  const fetchSession = async () => {
    const res = await API.get(`/orders/get-checkout-session?session_id=${sessionId}`);
    console.error('Stripe session:', res.data);
  };

  return (
    <div className="fail-page">
      <h1>Payment Failed</h1>
      <p>Unfortunately, your payment could not be processed. Please try again later.</p>
      <p>If the problem persists, contact our support team for assistance.</p>
    </div>
  );
}
export default FailPage;