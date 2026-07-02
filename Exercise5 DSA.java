/**
 * Exercise 5: Task Management System
 *
 * Linked list types:
 * - Singly Linked List: each node points to next node.
 * - Doubly Linked List: each node points to previous and next.
 */
public class Exercise5 {

    static class Task {
        int taskId;
        String taskName;
        String status;

        Task(int taskId, String taskName, String status) {
            this.taskId = taskId;
            this.taskName = taskName;
            this.status = status;
        }

        @Override
        public String toString() {
            return "Task{id=" + taskId + ", name='" + taskName + "', status='" + status + "'}";
        }
    }

    static class Node {
        Task data;
        Node next;

        Node(Task data) {
            this.data = data;
        }
    }

    static class TaskLinkedList {
        private Node head;

        public void addTask(Task task) {
            Node newNode = new Node(task);
            if (head == null) {
                head = newNode;
                return;
            }
            Node current = head;
            while (current.next != null) {
                current = current.next;
            }
            current.next = newNode;
        }

        public Task searchTask(int taskId) {
            Node current = head;
            while (current != null) {
                if (current.data.taskId == taskId) {
                    return current.data;
                }
                current = current.next;
            }
            return null;
        }

        public void traverseTasks() {
            Node current = head;
            while (current != null) {
                System.out.println(current.data);
                current = current.next;
            }
        }

        public boolean deleteTask(int taskId) {
            if (head == null) {
                return false;
            }

            if (head.data.taskId == taskId) {
                head = head.next;
                return true;
            }

            Node current = head;
            while (current.next != null && current.next.data.taskId != taskId) {
                current = current.next;
            }

            if (current.next == null) {
                return false;
            }

            current.next = current.next.next;
            return true;
        }
    }

    public static void main(String[] args) {
        TaskLinkedList list = new TaskLinkedList();

        list.addTask(new Task(1, "Design database", "Pending"));
        list.addTask(new Task(2, "Implement API", "In Progress"));
        list.addTask(new Task(3, "Write tests", "Pending"));

        System.out.println("All tasks:");
        list.traverseTasks();

        System.out.println("\nSearch id 2: " + list.searchTask(2));
        System.out.println("Delete id 1: " + list.deleteTask(1));

        System.out.println("\nAfter delete:");
        list.traverseTasks();

        /*
         * Time complexity:
         * - add (at end): O(n)
         * - search: O(n)
         * - traverse: O(n)
         * - delete: O(n)
         *
         * Advantages over arrays for dynamic data:
         * - No shifting needed on deletion.
         * - Easy growth without fixed capacity.
         * - Efficient insert/delete at head: O(1).
         */
    }
}
