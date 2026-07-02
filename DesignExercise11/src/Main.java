interface CustomerRepository {
    String findCustomerById(String customerId);
}

class CustomerRepositoryImpl implements CustomerRepository {
    public String findCustomerById(String customerId) {
        if ("C101".equals(customerId)) {
            return "Alice Johnson";
        }
        if ("C102".equals(customerId)) {
            return "Bob Smith";
        }
        return "Customer not found";
    }
}

class CustomerService {
    private final CustomerRepository customerRepository;

    CustomerService(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    String getCustomerName(String customerId) {
        return customerRepository.findCustomerById(customerId);
    }
}

public class Main {
    public static void main(String[] args) {
        CustomerRepository repository = new CustomerRepositoryImpl();
        CustomerService service = new CustomerService(repository);

        System.out.println("C101 -> " + service.getCustomerName("C101"));
        System.out.println("C999 -> " + service.getCustomerName("C999"));
    }
}
