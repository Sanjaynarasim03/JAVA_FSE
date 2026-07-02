import java.util.Arrays;
import java.util.Comparator;

/**
 * Exercise 6: Library Management System
 *
 * Search algorithms:
 * - Linear search: checks each element one by one.
 * - Binary search: repeatedly halves the search space (requires sorted data).
 */
public class Exercise6 {

    static class Book {
        int bookId;
        String title;
        String author;

        Book(int bookId, String title, String author) {
            this.bookId = bookId;
            this.title = title;
            this.author = author;
        }

        @Override
        public String toString() {
            return "Book{id=" + bookId + ", title='" + title + "', author='" + author + "'}";
        }
    }

    public static Book linearSearchByTitle(Book[] books, String title) {
        for (Book book : books) {
            if (book.title.equalsIgnoreCase(title)) {
                return book;
            }
        }
        return null;
    }

    public static Book binarySearchByTitle(Book[] sortedBooks, String title) {
        int low = 0;
        int high = sortedBooks.length - 1;

        while (low <= high) {
            int mid = low + (high - low) / 2;
            int cmp = sortedBooks[mid].title.compareToIgnoreCase(title);
            if (cmp == 0) {
                return sortedBooks[mid];
            } else if (cmp < 0) {
                low = mid + 1;
            } else {
                high = mid - 1;
            }
        }
        return null;
    }

    public static void main(String[] args) {
        Book[] library = {
            new Book(1, "The Alchemist", "Paulo Coelho"),
            new Book(2, "Clean Code", "Robert C. Martin"),
            new Book(3, "1984", "George Orwell"),
            new Book(4, "Atomic Habits", "James Clear"),
            new Book(5, "Sapiens", "Yuval Noah Harari")
        };

        Book linearResult = linearSearchByTitle(library, "Clean Code");
        System.out.println("Linear search result: " + linearResult);

        Book[] sortedLibrary = Arrays.copyOf(library, library.length);
        Arrays.sort(sortedLibrary, Comparator.comparing(b -> b.title.toLowerCase()));

        Book binaryResult = binarySearchByTitle(sortedLibrary, "Clean Code");
        System.out.println("Binary search result: " + binaryResult);

        /*
         * Complexity:
         * - Linear search: O(n)
         * - Binary search: O(log n)
         *
         * Usage guidance:
         * - Use linear search for small or unsorted datasets.
         * - Use binary search for large, sorted datasets with frequent queries.
         */
    }
}
