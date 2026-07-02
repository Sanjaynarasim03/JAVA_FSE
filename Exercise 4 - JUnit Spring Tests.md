# Exercise 4 - JUnit Spring Tests

## Scenario
Write integration tests for a Spring Boot application using @SpringBootTest and @WebMvcTest.

---

## Dependencies (pom.xml)

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-test</artifactId>
    <scope>test</scope>
</dependency>
<!-- Includes: JUnit 5, Mockito, MockMvc, Spring Test -->
```

---

## BookControllerIntegrationTest.java (@SpringBootTest)
`src/test/java/com/example/BookControllerIntegrationTest.java`

```java
package com.example;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.*;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.*;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Full integration test — loads the entire Spring Boot application context
 * and makes real HTTP calls through MockMvc.
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@DisplayName("BookController Integration Tests")
class BookControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("GET /api/books - Should return all books")
    void testGetAllBooks() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get("/api/books")
                .accept(MediaType.APPLICATION_JSON))
            .andDo(print())
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$").isArray());
    }

    @Test
    @DisplayName("POST /api/books - Should create a new book")
    void testCreateBook() throws Exception {
        Book newBook = new Book(0, "Test Book", "Test Author", 25.00);

        mockMvc.perform(MockMvcRequestBuilders.post("/api/books")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(newBook)))
            .andDo(print())
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.title").value("Test Book"))
            .andExpect(jsonPath("$.author").value("Test Author"));
    }

    @Test
    @DisplayName("GET /api/books/1 - Should return specific book")
    void testGetBookById() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get("/api/books/1")
                .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(1));
    }

    @Test
    @DisplayName("GET /api/books/999 - Should return 404")
    void testGetBookByIdNotFound() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get("/api/books/999"))
            .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("DELETE /api/books/1 - Should return 204")
    void testDeleteBook() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.delete("/api/books/1"))
            .andExpect(status().isNoContent());
    }
}
```

---

## BookControllerWebMvcTest.java (@WebMvcTest)
`src/test/java/com/example/BookControllerWebMvcTest.java`

```java
package com.example;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.*;

import java.util.*;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Slice test — only loads the Web layer (controllers), not the full context.
 * Uses @MockBean to mock service layer.
 */
@WebMvcTest(BookController.class)
@DisplayName("BookController Slice Tests (@WebMvcTest)")
class BookControllerWebMvcTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private BookService bookService;  // Mock the service, not a real bean

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("GET /api/books should return list of books")
    void testGetAllBooks() throws Exception {
        // ARRANGE: Mock service behavior
        List<Book> mockBooks = Arrays.asList(
            new Book(1, "Clean Code", "Martin", 39.99),
            new Book(2, "Effective Java", "Bloch", 44.99)
        );
        when(bookService.getAllBooks()).thenReturn(mockBooks);

        // ACT + ASSERT: Perform request and verify
        mockMvc.perform(get("/api/books").accept(MediaType.APPLICATION_JSON))
            .andDo(print())
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.length()").value(2))
            .andExpect(jsonPath("$[0].title").value("Clean Code"))
            .andExpect(jsonPath("$[1].author").value("Bloch"));

        verify(bookService, times(1)).getAllBooks();
    }

    @Test
    @DisplayName("GET /api/books/1 should return single book")
    void testGetBookById() throws Exception {
        Book book = new Book(1, "Clean Code", "Martin", 39.99);
        when(bookService.getBookById(1)).thenReturn(book);

        mockMvc.perform(get("/api/books/1"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(1))
            .andExpect(jsonPath("$.title").value("Clean Code"));
    }

    @Test
    @DisplayName("POST /api/books should create and return book")
    void testCreateBook() throws Exception {
        Book input = new Book(0, "New Book", "Author", 20.00);
        Book saved = new Book(10, "New Book", "Author", 20.00);

        when(bookService.addBook(any(Book.class))).thenReturn(saved);

        mockMvc.perform(post("/api/books")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(input)))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.id").value(10));
    }

    @Test
    @DisplayName("GET /api/books/999 should return 404 when service throws")
    void testGetBookNotFound() throws Exception {
        when(bookService.getBookById(999))
            .thenThrow(new RuntimeException("Book not found: 999"));

        mockMvc.perform(get("/api/books/999"))
            .andExpect(status().isNotFound());
    }
}
```

---

## @SpringBootTest vs @WebMvcTest

| Feature | `@SpringBootTest` | `@WebMvcTest` |
|---------|-------------------|---------------|
| Context loaded | Full application context | Only Web layer (controllers) |
| Speed | Slower | Faster |
| Real services | Yes | No — must @MockBean |
| Best for | Integration / E2E tests | Controller unit tests |
| DB interaction | Real / H2 | None (mocked) |
