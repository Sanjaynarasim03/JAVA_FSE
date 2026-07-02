/**
 * Exercise 4: Employee Management System
 *
 * Array representation in memory:
 * - Arrays store elements in contiguous memory locations.
 * - This enables O(1) indexed access due to direct address calculation.
 *
 * Advantages:
 * - Fast random access.
 * - Cache-friendly traversal.
 */
public class Exercise4 {

    static class Employee {
        int employeeId;
        String name;
        String position;
        double salary;

        Employee(int employeeId, String name, String position, double salary) {
            this.employeeId = employeeId;
            this.name = name;
            this.position = position;
            this.salary = salary;
        }

        @Override
        public String toString() {
            return "Employee{id=" + employeeId + ", name='" + name + "', position='" + position + "', salary=" + salary + "}";
        }
    }

    static class EmployeeArrayManager {
        private final Employee[] employees;
        private int size;

        EmployeeArrayManager(int capacity) {
            this.employees = new Employee[capacity];
            this.size = 0;
        }

        public boolean addEmployee(Employee employee) {
            if (size == employees.length) {
                return false;
            }
            employees[size++] = employee;
            return true;
        }

        public Employee searchEmployee(int employeeId) {
            for (int i = 0; i < size; i++) {
                if (employees[i].employeeId == employeeId) {
                    return employees[i];
                }
            }
            return null;
        }

        public void traverseEmployees() {
            for (int i = 0; i < size; i++) {
                System.out.println(employees[i]);
            }
        }

        public boolean deleteEmployee(int employeeId) {
            int index = -1;
            for (int i = 0; i < size; i++) {
                if (employees[i].employeeId == employeeId) {
                    index = i;
                    break;
                }
            }
            if (index == -1) {
                return false;
            }

            for (int i = index; i < size - 1; i++) {
                employees[i] = employees[i + 1];
            }
            employees[size - 1] = null;
            size--;
            return true;
        }
    }

    public static void main(String[] args) {
        EmployeeArrayManager manager = new EmployeeArrayManager(10);

        manager.addEmployee(new Employee(1, "John", "Developer", 70000));
        manager.addEmployee(new Employee(2, "Sara", "Manager", 90000));
        manager.addEmployee(new Employee(3, "Mike", "Analyst", 65000));

        System.out.println("All employees:");
        manager.traverseEmployees();

        System.out.println("\nSearch id 2: " + manager.searchEmployee(2));
        System.out.println("Delete id 1: " + manager.deleteEmployee(1));

        System.out.println("\nAfter delete:");
        manager.traverseEmployees();

        /*
         * Time complexity:
         * - add: O(1) (amortized if dynamic array; fixed array is strict O(1) until full)
         * - search: O(n)
         * - traverse: O(n)
         * - delete: O(n) (search + shift)
         *
         * Limitations:
         * - Fixed size (in this example).
         * - Costly mid-array insert/delete due to shifts.
         *
         * When to use arrays:
         * - Known maximum size and frequent indexed access.
         */
    }
}
