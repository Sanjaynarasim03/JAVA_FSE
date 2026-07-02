import java.util.Arrays;
import java.util.Comparator;

public class Exercise2 {

    static class Product {
        int productId;
        String productName;
        String category;

        Product(int productId, String productName, String category) {
            this.productId = productId;
            this.productName = productName;
            this.category = category;
        }

        @Override
        public String toString() {
            return "Product{id=" + productId + ", name='" + productName + "', category='" + category + "'}";
        }
    }

    public static Product linearSearch(Product[] products, String targetName) {
        for (Product p : products) {
            if (p.productName.equalsIgnoreCase(targetName)) {
                return p;
            }
        }
        return null;
    }

    public static Product binarySearchByName(Product[] sortedProducts, String targetName) {
        int low = 0;
        int high = sortedProducts.length - 1;

        while (low <= high) {
            int mid = low + (high - low) / 2;
            int cmp = sortedProducts[mid].productName.compareToIgnoreCase(targetName);

            if (cmp == 0) {
                return sortedProducts[mid];
            } else if (cmp < 0) {
                low = mid + 1;
            } else {
                high = mid - 1;
            }
        }
        return null;
    }

    public static void main(String[] args) {
        Product[] productsForLinear = {
            new Product(1, "Laptop", "Electronics"),
            new Product(2, "Shoes", "Fashion"),
            new Product(3, "Phone", "Electronics"),
            new Product(4, "Watch", "Accessories"),
            new Product(5, "Backpack", "Travel")
        };

        Product linearResult = linearSearch(productsForLinear, "Watch");
        System.out.println("Linear search result: " + linearResult);

        Product[] productsForBinary = Arrays.copyOf(productsForLinear, productsForLinear.length);
        Arrays.sort(productsForBinary, Comparator.comparing(p -> p.productName.toLowerCase()));

        Product binaryResult = binarySearchByName(productsForBinary, "Watch");
        System.out.println("Binary search result: " + binaryResult);
    }
}
