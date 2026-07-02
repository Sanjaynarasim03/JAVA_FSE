import java.util.Arrays;

public class Exercise3 {

    static class Order {
        int orderId;
        String customerName;
        double totalPrice;

        Order(int orderId, String customerName, double totalPrice) {
            this.orderId = orderId;
            this.customerName = customerName;
            this.totalPrice = totalPrice;
        }

        @Override
        public String toString() {
            return "Order{id=" + orderId + ", customer='" + customerName + "', total=" + totalPrice + "}";
        }
    }

    public static void bubbleSort(Order[] orders) {
        int n = orders.length;
        for (int i = 0; i < n - 1; i++) {
            boolean swapped = false;
            for (int j = 0; j < n - 1 - i; j++) {
                if (orders[j].totalPrice > orders[j + 1].totalPrice) {
                    Order temp = orders[j];
                    orders[j] = orders[j + 1];
                    orders[j + 1] = temp;
                    swapped = true;
                }
            }
            if (!swapped) {
                break;
            }
        }
    }

    public static void quickSort(Order[] orders, int low, int high) {
        if (low < high) {
            int pivotIndex = partition(orders, low, high);
            quickSort(orders, low, pivotIndex - 1);
            quickSort(orders, pivotIndex + 1, high);
        }
    }

    private static int partition(Order[] orders, int low, int high) {
        double pivot = orders[high].totalPrice;
        int i = low - 1;

        for (int j = low; j < high; j++) {
            if (orders[j].totalPrice <= pivot) {
                i++;
                Order temp = orders[i];
                orders[i] = orders[j];
                orders[j] = temp;
            }
        }

        Order temp = orders[i + 1];
        orders[i + 1] = orders[high];
        orders[high] = temp;
        return i + 1;
    }

    private static void printOrders(String title, Order[] orders) {
        System.out.println(title);
        for (Order order : orders) {
            System.out.println(order);
        }
    }

    public static void main(String[] args) {
        Order[] baseOrders = {
            new Order(1, "Alice", 4500.0),
            new Order(2, "Bob", 1200.0),
            new Order(3, "Charlie", 9800.0),
            new Order(4, "Diana", 3000.0),
            new Order(5, "Ethan", 7600.0)
        };

        Order[] bubbleOrders = Arrays.copyOf(baseOrders, baseOrders.length);
        bubbleSort(bubbleOrders);
        printOrders("Bubble Sort (by totalPrice):", bubbleOrders);

        Order[] quickOrders = Arrays.copyOf(baseOrders, baseOrders.length);
        quickSort(quickOrders, 0, quickOrders.length - 1);
        printOrders("\nQuick Sort (by totalPrice):", quickOrders);
    }
}
