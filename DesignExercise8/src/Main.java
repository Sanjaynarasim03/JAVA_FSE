interface PaymentStrategy {
    void pay(double amount);
}

class CreditCardPayment implements PaymentStrategy {
    private final String cardNumber;

    CreditCardPayment(String cardNumber) {
        this.cardNumber = cardNumber;
    }

    public void pay(double amount) {
        String masked = "****" + cardNumber.substring(cardNumber.length() - 4);
        System.out.println("Paid " + amount + " using Credit Card " + masked);
    }
}

class PayPalPayment implements PaymentStrategy {
    private final String email;

    PayPalPayment(String email) {
        this.email = email;
    }

    public void pay(double amount) {
        System.out.println("Paid " + amount + " using PayPal account " + email);
    }
}

class PaymentContext {
    private PaymentStrategy strategy;

    void setPaymentStrategy(PaymentStrategy strategy) {
        this.strategy = strategy;
    }

    void executePayment(double amount) {
        if (strategy == null) {
            throw new IllegalStateException("Payment strategy not selected");
        }
        strategy.pay(amount);
    }
}

public class Main {
    public static void main(String[] args) {
        PaymentContext context = new PaymentContext();

        context.setPaymentStrategy(new CreditCardPayment("1234567812345678"));
        context.executePayment(2500.0);

        context.setPaymentStrategy(new PayPalPayment("user@example.com"));
        context.executePayment(1200.5);
    }
}
