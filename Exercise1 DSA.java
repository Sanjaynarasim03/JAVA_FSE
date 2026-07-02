import java.util.HashMap;
import java.util.Map;

public class Exercise1 {

    static class Product {
        int productId;
        String productName;
        int quantity;
        double price;

        Product(int productId, String productName, int quantity, double price) {
            this.productId = productId;
            this.productName = productName;
            this.quantity = quantity;
            this.price = price;
        }

        @Override
        public String toString() {
            return "Product{id=" + productId + ", name='" + productName + "', qty=" + quantity + ", price=" + price + "}";
        }
    }

    static class InventoryManager {
        private final Map<Integer, Product> inventory = new HashMap<>();

        public void addProduct(Product product) {
            inventory.put(product.productId, product);
        }

        public boolean updateProduct(int productId, String newName, int newQuantity, double newPrice) {
            Product existing = inventory.get(productId);
            if (existing == null) {
                return false;
            }
            existing.productName = newName;
            existing.quantity = newQuantity;
            existing.price = newPrice;
            return true;
        }

        public boolean deleteProduct(int productId) {
            return inventory.remove(productId) != null;
        }

        public Product getProduct(int productId) {
            return inventory.get(productId);
        }

        public void printAllProducts() {
            for (Product p : inventory.values()) {
                System.out.println(p);
            }
        }
    }

    public static void main(String[] args) {
        InventoryManager manager = new InventoryManager();

        manager.addProduct(new Product(101, "Keyboard", 30, 1499.0));
        manager.addProduct(new Product(102, "Mouse", 50, 799.0));
        manager.addProduct(new Product(103, "Monitor", 20, 10999.0));

        System.out.println("After add:");
        manager.printAllProducts();

        System.out.println("\nUpdate id 102: " + manager.updateProduct(102, "Wireless Mouse", 45, 999.0));
        System.out.println("Product 102 => " + manager.getProduct(102));

        System.out.println("\nDelete id 101: " + manager.deleteProduct(101));
        System.out.println("After delete:");
        manager.printAllProducts();
    }
}
