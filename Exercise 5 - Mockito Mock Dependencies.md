# Exercise 5 - Mockito Mock Dependencies

## Scenario
Mock complex service dependencies using Mockito — including argument captors, spy objects, and advanced stubbing.

---

## Production Code

### EmailService.java
```java
package com.example;

public interface EmailService {
    boolean sendEmail(String to, String subject, String body);
    boolean sendWelcomeEmail(String userEmail, String userName);
}
```

### UserRepository.java
```java
package com.example;

import java.util.Optional;

public interface UserRepository {
    Optional<User> findById(int id);
    User save(User user);
    boolean existsByEmail(String email);
}
```

### User.java
```java
package com.example;

public class User {
    private int id;
    private String name;
    private String email;
    private boolean active;

    public User() {}
    public User(int id, String name, String email) {
        this.id = id; this.name = name; this.email = email; this.active = true;
    }
    public int getId() { return id; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
}
```

### UserService.java
```java
package com.example;

import java.util.Optional;

public class UserService {

    private final UserRepository userRepository;
    private final EmailService emailService;

    public UserService(UserRepository userRepository, EmailService emailService) {
        this.userRepository = userRepository;
        this.emailService = emailService;
    }

    public User registerUser(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already registered: " + user.getEmail());
        }
        User saved = userRepository.save(user);
        emailService.sendWelcomeEmail(saved.getEmail(), saved.getName());
        return saved;
    }

    public User getUserById(int id) {
        return userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found: " + id));
    }

    public void deactivateUser(int id) {
        User user = getUserById(id);
        user.setActive(false);
        userRepository.save(user);
        emailService.sendEmail(user.getEmail(), "Account Deactivated",
            "Your account has been deactivated.");
    }
}
```

---

## UserServiceTest.java (Advanced Mockito)
`src/test/java/com/example/UserServiceTest.java`

```java
package com.example;

import org.junit.jupiter.api.*;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import static org.mockito.ArgumentMatchers.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("UserService Mockito Dependency Tests")
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private EmailService emailService;

    @InjectMocks
    private UserService userService;

    @Captor
    private ArgumentCaptor<User> userCaptor;

    @Captor
    private ArgumentCaptor<String> stringCaptor;

    // ---- Test: registerUser ----

    @Test
    @DisplayName("Should register user and send welcome email")
    void testRegisterUser_Success() {
        User input = new User(0, "Alice", "alice@example.com");
        User saved = new User(1, "Alice", "alice@example.com");

        when(userRepository.existsByEmail("alice@example.com")).thenReturn(false);
        when(userRepository.save(input)).thenReturn(saved);
        when(emailService.sendWelcomeEmail(anyString(), anyString())).thenReturn(true);

        User result = userService.registerUser(input);

        // Verify result
        assertNotNull(result);
        assertEquals(1, result.getId());
        assertEquals("Alice", result.getName());

        // Capture the user passed to repository.save()
        verify(userRepository).save(userCaptor.capture());
        User capturedUser = userCaptor.getValue();
        assertEquals("alice@example.com", capturedUser.getEmail());

        // Verify welcome email was sent with correct args
        verify(emailService).sendWelcomeEmail(
            "alice@example.com", "Alice"
        );
    }

    @Test
    @DisplayName("Should throw if email already registered")
    void testRegisterUser_EmailAlreadyExists() {
        User user = new User(0, "Bob", "bob@example.com");
        when(userRepository.existsByEmail("bob@example.com")).thenReturn(true);

        RuntimeException ex = assertThrows(
            RuntimeException.class,
            () -> userService.registerUser(user)
        );
        assertTrue(ex.getMessage().contains("bob@example.com"));

        // save and email should NEVER be called
        verify(userRepository, never()).save(any());
        verify(emailService, never()).sendWelcomeEmail(anyString(), anyString());
    }

    // ---- Test: deactivateUser ----

    @Test
    @DisplayName("Should deactivate user and send email")
    void testDeactivateUser() {
        User user = new User(1, "Charlie", "charlie@example.com");
        when(userRepository.findById(1)).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenReturn(user);
        when(emailService.sendEmail(anyString(), anyString(), anyString())).thenReturn(true);

        userService.deactivateUser(1);

        // Verify user was saved with active=false
        verify(userRepository).save(userCaptor.capture());
        assertFalse(userCaptor.getValue().isActive());

        // Capture and verify the email arguments
        verify(emailService).sendEmail(
            stringCaptor.capture(),
            stringCaptor.capture(),
            stringCaptor.capture()
        );
        assertEquals("charlie@example.com", stringCaptor.getAllValues().get(0));
        assertEquals("Account Deactivated", stringCaptor.getAllValues().get(1));
    }

    // ---- Test: Spy ----

    @Test
    @DisplayName("Spy test: partial mock of real object")
    void testWithSpy() {
        // Spy wraps a real object but allows stubbing specific methods
        UserRepository realRepo = new UserRepository() {
            @Override
            public Optional<User> findById(int id) {
                return Optional.of(new User(id, "SpyUser", "spy@test.com"));
            }
            @Override
            public User save(User user) { return user; }
            @Override
            public boolean existsByEmail(String email) { return false; }
        };

        UserRepository spyRepo = spy(realRepo);

        // Override only findById for ID 999
        doReturn(Optional.empty()).when(spyRepo).findById(999);

        // Real method for ID 1
        Optional<User> realResult = spyRepo.findById(1);
        assertTrue(realResult.isPresent());
        assertEquals("SpyUser", realResult.get().getName());

        // Stubbed method for ID 999
        Optional<User> emptyResult = spyRepo.findById(999);
        assertFalse(emptyResult.isPresent());
    }

    // ---- Test: thenThrow ----

    @Test
    @DisplayName("Should handle repository exception")
    void testRepositoryThrowsException() {
        when(userRepository.findById(anyInt()))
            .thenThrow(new RuntimeException("Database connection failed"));

        RuntimeException ex = assertThrows(
            RuntimeException.class,
            () -> userService.getUserById(1)
        );
        assertEquals("Database connection failed", ex.getMessage());
    }

    // ---- Test: Consecutive stubbing ----

    @Test
    @DisplayName("Should handle consecutive stub calls differently")
    void testConsecutiveStubbing() {
        when(userRepository.findById(1))
            .thenReturn(Optional.of(new User(1, "Alice", "a@test.com")))  // 1st call
            .thenReturn(Optional.empty())                                   // 2nd call
            .thenThrow(new RuntimeException("DB Error"));                   // 3rd call

        // First call returns user
        assertTrue(userRepository.findById(1).isPresent());

        // Second call returns empty
        assertFalse(userRepository.findById(1).isPresent());

        // Third call throws
        assertThrows(RuntimeException.class, () -> userRepository.findById(1));
    }
}
```

---

## Key Advanced Mockito Features

| Feature | Usage | Purpose |
|---------|-------|---------|
| `@Captor` | `ArgumentCaptor<T>` | Capture and inspect args |
| `spy()` | `spy(realObject)` | Partial mock of real object |
| `doReturn()` | `doReturn(val).when(spy).method()` | Stub spy methods |
| `thenThrow()` | `.thenThrow(ex)` | Stub exceptions |
| `thenAnswer()` | `.thenAnswer(inv -> ...)` | Dynamic return values |
| Consecutive stubs | `.thenReturn(a).thenReturn(b)` | Different responses per call |
