# Exercise 3 - Mockito Basics

## Scenario
Use Mockito to mock dependencies and test the service layer in isolation.

---

## Dependencies (pom.xml)

```xml
<dependency>
    <groupId>org.mockito</groupId>
    <artifactId>mockito-core</artifactId>
    <version>5.5.0</version>
    <scope>test</scope>
</dependency>
<dependency>
    <groupId>org.mockito</groupId>
    <artifactId>mockito-junit-jupiter</artifactId>
    <version>5.5.0</version>
    <scope>test</scope>
</dependency>
```

---

## Production Code

### BookRepository.java (Interface)
```java
package com.example;

import java.util.List;
import java.util.Optional;

public interface BookRepository {
    Optional<Book> findById(int id);
    List<Book> findAll();
    Book save(Book book);
    void deleteById(int id);
    boolean existsById(int id);
}
```

### Book.java
```java
package com.example;

public class Book {
    private int id;
    private String title;
    private String author;
    private double price;

    public Book() {}
    public Book(int id, String title, String author, double price) {
        this.id = id;
        this.title = title;
        this.author = author;
        this.price = price;
    }
    // Getters and Setters
    public int getId() { return id; }
    public String getTitle() { return title; }
    public String getAuthor() { return author; }
    public double getPrice() { return price; }
    public void setTitle(String title) { this.title = title; }
    public void setPrice(double price) { this.price = price; }
}
```

### BookService.java
```java
package com.example;

import java.util.List;
import java.util.Optional;

public class BookService {

    private final BookRepository bookRepository;

    public BookService(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }

    public Book getBookById(int id) {
        return bookRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Book not found: " + id));
    }

    public List<Book> getAllBooks() {
        return bookRepository.findAll();
    }

    public Book addBook(Book book) {
        return bookRepository.save(book);
    }

    public Book updatePrice(int id, double newPrice) {
        Book book = getBookById(id);
        book.setPrice(newPrice);
        return bookRepository.save(book);
    }

    public void deleteBook(int id) {
        if (!bookRepository.existsById(id)) {
            throw new RuntimeException("Cannot delete: book not found: " + id);
        }
        bookRepository.deleteById(id);
    }
}
```

---

## BookServiceTest.java (Mockito Basics)
`src/test/java/com/example/BookServiceTest.java`

```java
package com.example;

import org.junit.jupiter.api.*;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)  // Enable Mockito annotations in JUnit 5
@DisplayName("BookService Tests with Mockito")
class BookServiceTest {

    @Mock
    private BookRepository bookRepository;  // Create a mock of BookRepository

    @InjectMocks
    private BookService bookService;  // Create BookService and inject mocks

    private Book sampleBook;

    @BeforeEach
    void setUp() {
        sampleBook = new Book(1, "Clean Code", "Robert Martin", 39.99);
    }

    // ---- Test: getBookById ----

    @Test
    @DisplayName("Should return book when found by ID")
    void testGetBookById_Found() {
        // ARRANGE: Set up mock behavior
        when(bookRepository.findById(1)).thenReturn(Optional.of(sampleBook));

        // ACT: Call the method under test
        Book result = bookService.getBookById(1);

        // ASSERT: Verify result
        assertNotNull(result);
        assertEquals("Clean Code", result.getTitle());
        assertEquals("Robert Martin", result.getAuthor());
        assertEquals(39.99, result.getPrice(), 0.001);

        // VERIFY: Ensure repository was called once with argument 1
        verify(bookRepository, times(1)).findById(1);
    }

    @Test
    @DisplayName("Should throw exception when book not found")
    void testGetBookById_NotFound() {
        // ARRANGE: Return empty Optional
        when(bookRepository.findById(99)).thenReturn(Optional.empty());

        // ACT + ASSERT: Verify exception is thrown
        RuntimeException exception = assertThrows(
            RuntimeException.class,
            () -> bookService.getBookById(99)
        );
        assertEquals("Book not found: 99", exception.getMessage());

        // Verify repository was called
        verify(bookRepository).findById(99);
    }

    // ---- Test: getAllBooks ----

    @Test
    @DisplayName("Should return all books from repository")
    void testGetAllBooks() {
        List<Book> mockBooks = Arrays.asList(
            new Book(1, "Clean Code", "Martin", 39.99),
            new Book(2, "Effective Java", "Bloch", 45.00),
            new Book(3, "The Pragmatic Programmer", "Hunt", 42.50)
        );

        when(bookRepository.findAll()).thenReturn(mockBooks);

        List<Book> result = bookService.getAllBooks();

        assertEquals(3, result.size());
        assertEquals("Clean Code", result.get(0).getTitle());

        verify(bookRepository, times(1)).findAll();
    }

    // ---- Test: addBook ----

    @Test
    @DisplayName("Should save and return new book")
    void testAddBook() {
        Book newBook = new Book(0, "Spring in Action", "Walls", 49.99);
        Book savedBook = new Book(5, "Spring in Action", "Walls", 49.99);

        when(bookRepository.save(newBook)).thenReturn(savedBook);

        Book result = bookService.addBook(newBook);

        assertNotNull(result);
        assertEquals(5, result.getId());
        verify(bookRepository).save(newBook);
    }

    // ---- Test: updatePrice ----

    @Test
    @DisplayName("Should update book price")
    void testUpdatePrice() {
        when(bookRepository.findById(1)).thenReturn(Optional.of(sampleBook));
        when(bookRepository.save(any(Book.class))).thenReturn(sampleBook);

        Book result = bookService.updatePrice(1, 29.99);

        verify(bookRepository).findById(1);
        verify(bookRepository).save(sampleBook);
        assertEquals(29.99, sampleBook.getPrice(), 0.001);
    }

    // ---- Test: deleteBook ----

    @Test
    @DisplayName("Should delete book successfully")
    void testDeleteBook_Success() {
        when(bookRepository.existsById(1)).thenReturn(true);
        doNothing().when(bookRepository).deleteById(1);

        assertDoesNotThrow(() -> bookService.deleteBook(1));

        verify(bookRepository).existsById(1);
        verify(bookRepository).deleteById(1);
    }

    @Test
    @DisplayName("Should throw exception when deleting non-existent book")
    void testDeleteBook_NotFound() {
        when(bookRepository.existsById(999)).thenReturn(false);

        RuntimeException ex = assertThrows(
            RuntimeException.class,
            () -> bookService.deleteBook(999)
        );
        assertTrue(ex.getMessage().contains("999"));

        // deleteById should NEVER be called
        verify(bookRepository, never()).deleteById(anyInt());
    }

    // ---- Verify interactions ----

    @Test
    @DisplayName("Should verify no other interactions after getAllBooks")
    void testNoOtherInteractions() {
        when(bookRepository.findAll()).thenReturn(Collections.emptyList());

        bookService.getAllBooks();

        verify(bookRepository).findAll();
        verifyNoMoreInteractions(bookRepository);
    }
}
```

---

## Key Mockito Concepts

| Concept | Annotation/Method | Purpose |
|---------|-------------------|---------|
| Mock | `@Mock` | Create a fake object |
| InjectMocks | `@InjectMocks` | Inject mocks into class under test |
| Stub | `when(...).thenReturn(...)` | Define mock behavior |
| Verify | `verify(mock).method()` | Confirm method was called |
| Never | `verify(mock, never()).method()` | Confirm method was NOT called |
| Times | `verify(mock, times(N)).method()` | Confirm exact call count |
| Any | `any(Type.class)` | Match any argument |
| Argument Captor | `@Captor` | Capture and inspect arguments |
