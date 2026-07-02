interface PaymentProcessor {
    void processPayment(double amount);
}

class PayPalGateway {
    void makePayPalPayment(double amountUsd) {
        System.out.println("Processed PayPal payment: $" + amountUsd);
    }
}

class StripeGateway {
    void charge(double amountUsd) {
        System.out.println("Processed Stripe payment: $" + amountUsd);
    }
}

class RazorpayGateway {
    void payInInr(double amountInr) {
        System.out.println("Processed Razorpay payment: INR " + amountInr);
    }
}

class PayPalAdapter implements PaymentProcessor {
    private final PayPalGateway payPalGateway;

    PayPalAdapter(PayPalGateway payPalGateway) {
        this.payPalGateway = payPalGateway;
    }

    public void processPayment(double amount) {
        payPalGateway.makePayPalPayment(amount);
    }
}

class StripeAdapter implements PaymentProcessor {
    private final StripeGateway stripeGateway;

    StripeAdapter(StripeGateway stripeGateway) {
        this.stripeGateway = stripeGateway;
    }

    public void processPayment(double amount) {
        stripeGateway.charge(amount);
    }
}

class RazorpayAdapter implements PaymentProcessor {
    private final RazorpayGateway razorpayGateway;

    RazorpayAdapter(RazorpayGateway razorpayGateway) {
        this.razorpayGateway = razorpayGateway;
    }

    public void processPayment(double amount) {
        razorpayGateway.payInInr(amount * 83.0);
    }
}

public class Main {
    public static void main(String[] args) {
        PaymentProcessor paypal = new PayPalAdapter(new PayPalGateway());
        PaymentProcessor stripe = new StripeAdapter(new StripeGateway());
        PaymentProcessor razorpay = new RazorpayAdapter(new RazorpayGateway());

        paypal.processPayment(100.0);
        stripe.processPayment(120.5);
        razorpay.processPayment(50.0);
    }
}
