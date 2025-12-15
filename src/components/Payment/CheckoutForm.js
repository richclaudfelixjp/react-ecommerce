import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button, Alert, Spinner } from 'react-bootstrap';
import './CheckoutForm.css';

const CheckoutForm = ({ clientSecret, onSuccess, onError, amount }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
          },
        }
      );

      if (stripeError) {
        setError(stripeError.message);
        onError(stripeError);
      } else if (paymentIntent.status === 'succeeded') {
        onSuccess(paymentIntent);
      }
    } catch (err) {
      setError('支払い処理中にエラーが発生しました。');
      onError(err);
    } finally {
      setProcessing(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
    hidePostalCode: true,
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label className="form-label">カード情報</label>
        <div className="card-element-container">
          <CardElement options={cardElementOptions} />
        </div>
      </div>

      {error && (
        <Alert variant="danger" className="mt-3">
          {error}
        </Alert>
      )}

      <div className="d-grid gap-2 mt-4">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={!stripe || processing}
        >
          {processing ? (
            <>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
                className="me-2"
              />
              処理中...
            </>
          ) : (
            `¥${amount.toLocaleString()} を支払う`
          )}
        </Button>
      </div>

      <div className="text-muted text-center mt-3" style={{ fontSize: '0.85rem' }}>
        <i className="fas fa-lock me-1"></i>
        安全な支払い処理
      </div>
    </form>
  );
};

export default CheckoutForm;