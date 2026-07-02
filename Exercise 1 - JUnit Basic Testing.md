# Exercise 1 - JUnit Basic Testing

## Scenario
Write basic JUnit 5 tests for a simple Calculator and String utility class.

---

## pom.xml (Test Dependencies)

```xml
<dependency>
    <groupId>org.junit.jupiter</groupId>
    <artifactId>junit-jupiter</artifactId>
    <version>5.10.0</version>
    <scope>test</scope>
</dependency>
<dependency>
    <groupId>org.assertj</groupId>
    <artifactId>assertj-core</artifactId>
    <version>3.24.2</version>
    <scope>test</scope>
</dependency>
```

---

## Calculator.java (Class Under Test)
`src/main/java/com/example/Calculator.java`

```java
package com.example;

public class Calculator {

    public int add(int a, int b) {
        return a + b;
    }

    public int subtract(int a, int b) {
        return a - b;
    }

    public int multiply(int a, int b) {
        return a * b;
    }

    public double divide(int a, int b) {
        if (b == 0) {
            throw new ArithmeticException("Cannot divide by zero!");
        }
        return (double) a / b;
    }

    public boolean isEven(int number) {
        return number % 2 == 0;
    }

    public int factorial(int n) {
        if (n < 0) throw new IllegalArgumentException("Factorial not defined for negative numbers");
        if (n == 0 || n == 1) return 1;
        return n * factorial(n - 1);
    }
}
```

---

## StringUtils.java (Class Under Test)
`src/main/java/com/example/StringUtils.java`

```java
package com.example;

public class StringUtils {

    public String reverse(String input) {
        if (input == null) return null;
        return new StringBuilder(input).reverse().toString();
    }

    public boolean isPalindrome(String input) {
        if (input == null) return false;
        String cleaned = input.toLowerCase().replaceAll("[^a-z0-9]", "");
        return cleaned.equals(new StringBuilder(cleaned).reverse().toString());
    }

    public int countVowels(String input) {
        if (input == null) return 0;
        return (int) input.toLowerCase().chars()
            .filter(c -> "aeiou".indexOf(c) >= 0)
            .count();
    }

    public String capitalize(String input) {
        if (input == null || input.isEmpty()) return input;
        return Character.toUpperCase(input.charAt(0)) + input.substring(1).toLowerCase();
    }
}
```

---

## CalculatorTest.java (JUnit 5 Test Class)
`src/test/java/com/example/CalculatorTest.java`

```java
package com.example;

import org.junit.jupiter.api.*;
import static org.junit.jupiter.api.Assertions.*;

@DisplayName("Calculator Test Suite")
class CalculatorTest {

    private Calculator calculator;

    @BeforeAll
    static void setUpClass() {
        System.out.println("=== Starting Calculator Tests ===");
    }

    @BeforeEach
    void setUp() {
        calculator = new Calculator();
        System.out.println("Calculator instance created.");
    }

    @AfterEach
    void tearDown() {
        System.out.println("Test completed.\n");
    }

    @AfterAll
    static void tearDownClass() {
        System.out.println("=== All Calculator Tests Finished ===");
    }

    // ---- Addition ----

    @Test
    @DisplayName("Should add two positive numbers")
    void testAddPositiveNumbers() {
        int result = calculator.add(5, 3);
        assertEquals(8, result, "5 + 3 should equal 8");
    }

    @Test
    @DisplayName("Should handle negative numbers in addition")
    void testAddNegativeNumbers() {
        int result = calculator.add(-5, -3);
        assertEquals(-8, result);
    }

    @Test
    @DisplayName("Should add zero correctly")
    void testAddZero() {
        assertEquals(10, calculator.add(10, 0));
        assertEquals(10, calculator.add(0, 10));
    }

    // ---- Subtraction ----

    @Test
    @DisplayName("Should subtract numbers correctly")
    void testSubtract() {
        assertEquals(7, calculator.subtract(10, 3));
        assertEquals(-3, calculator.subtract(2, 5));
    }

    // ---- Multiplication ----

    @Test
    @DisplayName("Should multiply numbers correctly")
    void testMultiply() {
        assertEquals(15, calculator.multiply(3, 5));
        assertEquals(0, calculator.multiply(5, 0));
        assertEquals(-12, calculator.multiply(3, -4));
    }

    // ---- Division ----

    @Test
    @DisplayName("Should divide numbers correctly")
    void testDivide() {
        assertEquals(2.5, calculator.divide(5, 2), 0.001);
        assertEquals(3.0, calculator.divide(9, 3), 0.001);
    }

    @Test
    @DisplayName("Should throw ArithmeticException when dividing by zero")
    void testDivideByZeroThrowsException() {
        ArithmeticException exception = assertThrows(
            ArithmeticException.class,
            () -> calculator.divide(10, 0)
        );
        assertEquals("Cannot divide by zero!", exception.getMessage());
    }

    // ---- isEven ----

    @Test
    @DisplayName("Should correctly identify even numbers")
    void testIsEven() {
        assertTrue(calculator.isEven(4));
        assertTrue(calculator.isEven(0));
        assertFalse(calculator.isEven(7));
        assertFalse(calculator.isEven(-3));
    }

    // ---- Factorial ----

    @Test
    @DisplayName("Should calculate factorial correctly")
    void testFactorial() {
        assertEquals(1, calculator.factorial(0));
        assertEquals(1, calculator.factorial(1));
        assertEquals(120, calculator.factorial(5));
        assertEquals(720, calculator.factorial(6));
    }

    @Test
    @DisplayName("Should throw exception for negative factorial input")
    void testFactorialNegativeInput() {
        assertThrows(IllegalArgumentException.class, () -> calculator.factorial(-1));
    }

    // ---- Grouped assertions ----

    @Test
    @DisplayName("All arithmetic operations should work together")
    void testMultipleAssertions() {
        assertAll("arithmetic operations",
            () -> assertEquals(10, calculator.add(7, 3)),
            () -> assertEquals(4, calculator.subtract(7, 3)),
            () -> assertEquals(21, calculator.multiply(7, 3)),
            () -> assertEquals(7.0 / 3, calculator.divide(7, 3), 0.001)
        );
    }
}
```

---

## StringUtilsTest.java
`src/test/java/com/example/StringUtilsTest.java`

```java
package com.example;

import org.junit.jupiter.api.*;
import static org.junit.jupiter.api.Assertions.*;

@DisplayName("StringUtils Test Suite")
class StringUtilsTest {

    private StringUtils stringUtils;

    @BeforeEach
    void setUp() {
        stringUtils = new StringUtils();
    }

    @Test
    @DisplayName("Should reverse a string correctly")
    void testReverse() {
        assertEquals("olleH", stringUtils.reverse("Hello"));
        assertEquals("", stringUtils.reverse(""));
        assertNull(stringUtils.reverse(null));
    }

    @Test
    @DisplayName("Should correctly identify palindromes")
    void testIsPalindrome() {
        assertTrue(stringUtils.isPalindrome("racecar"));
        assertTrue(stringUtils.isPalindrome("A man a plan a canal Panama"));
        assertFalse(stringUtils.isPalindrome("hello"));
        assertFalse(stringUtils.isPalindrome(null));
    }

    @Test
    @DisplayName("Should count vowels correctly")
    void testCountVowels() {
        assertEquals(2, stringUtils.countVowels("Hello"));
        assertEquals(3, stringUtils.countVowels("Education"));
        assertEquals(0, stringUtils.countVowels("gym"));
        assertEquals(0, stringUtils.countVowels(null));
    }

    @Test
    @DisplayName("Should capitalize correctly")
    void testCapitalize() {
        assertEquals("Hello", stringUtils.capitalize("hello"));
        assertEquals("Hello", stringUtils.capitalize("HELLO"));
        assertEquals("A", stringUtils.capitalize("a"));
        assertNull(stringUtils.capitalize(null));
    }
}
```

---

## Run Tests

```bash
mvn test
# Or run a specific class:
mvn test -Dtest=CalculatorTest
```

---

## JUnit 5 Key Annotations

| Annotation | Purpose |
|------------|---------|
| `@Test` | Marks a method as a test |
| `@BeforeAll` | Runs once before all tests (static) |
| `@BeforeEach` | Runs before each test |
| `@AfterEach` | Runs after each test |
| `@AfterAll` | Runs once after all tests (static) |
| `@DisplayName` | Custom test name in reports |
| `@Disabled` | Skip a test |
