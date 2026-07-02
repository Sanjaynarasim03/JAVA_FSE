# Exercise 2 - JUnit Advanced Testing

## Scenario
Use advanced JUnit 5 features: parameterized tests, test lifecycle, assumptions, nested tests, and repeated tests.

---

## AdvancedCalculatorTest.java
`src/test/java/com/example/AdvancedCalculatorTest.java`

```java
package com.example;

import org.junit.jupiter.api.*;
import org.junit.jupiter.api.condition.*;
import org.junit.jupiter.params.*;
import org.junit.jupiter.params.provider.*;
import org.junit.jupiter.api.RepeatedTest;
import org.junit.jupiter.api.Assumptions;

import java.util.stream.Stream;
import static org.junit.jupiter.api.Assertions.*;

@DisplayName("Advanced Calculator Tests")
class AdvancedCalculatorTest {

    private Calculator calculator;

    @BeforeEach
    void setUp() {
        calculator = new Calculator();
    }

    // ============ @ParameterizedTest ============

    /**
     * Test add() with multiple value pairs using @CsvSource
     */
    @ParameterizedTest
    @CsvSource({
        "1, 1, 2",
        "2, 3, 5",
        "10, -3, 7",
        "0, 0, 0",
        "-5, -5, -10"
    })
    @DisplayName("Add should return correct sum for various inputs")
    void testAddParameterized(int a, int b, int expected) {
        assertEquals(expected, calculator.add(a, b));
    }

    /**
     * Test isEven() with @ValueSource
     */
    @ParameterizedTest
    @ValueSource(ints = {2, 4, 6, 100, -8, 0})
    @DisplayName("isEven should return true for all even numbers")
    void testIsEvenForEvenNumbers(int number) {
        assertTrue(calculator.isEven(number));
    }

    @ParameterizedTest
    @ValueSource(ints = {1, 3, 7, -11, 99})
    @DisplayName("isEven should return false for all odd numbers")
    void testIsEvenForOddNumbers(int number) {
        assertFalse(calculator.isEven(number));
    }

    /**
     * Test factorial() with @MethodSource
     */
    @ParameterizedTest
    @MethodSource("factorialProvider")
    @DisplayName("Factorial should compute correctly")
    void testFactorialParameterized(int input, int expected) {
        assertEquals(expected, calculator.factorial(input));
    }

    static Stream<Arguments> factorialProvider() {
        return Stream.of(
            Arguments.of(0, 1),
            Arguments.of(1, 1),
            Arguments.of(2, 2),
            Arguments.of(3, 6),
            Arguments.of(4, 24),
            Arguments.of(5, 120)
        );
    }

    // ============ @RepeatedTest ============

    @RepeatedTest(value = 3, name = "{displayName} {currentRepetition}/{totalRepetitions}")
    @DisplayName("Add should consistently return same result")
    void testAddRepeatedly(RepetitionInfo info) {
        System.out.println("Running repetition " + info.getCurrentRepetition());
        assertEquals(15, calculator.add(7, 8));
    }

    // ============ Assumptions ============

    @Test
    @DisplayName("Skip test if not running on CI")
    void testOnlyOnCI() {
        // Test is skipped if assumption fails (not marked as failed)
        Assumptions.assumeTrue(
            "true".equals(System.getenv("CI")),
            "Skipping: not running on CI environment"
        );
        assertEquals(10, calculator.add(4, 6));
    }

    // ============ @Nested Tests ============

    @Nested
    @DisplayName("Division Tests")
    class DivisionTests {

        @Test
        @DisplayName("Positive division")
        void testPositiveDivision() {
            assertEquals(2.5, calculator.divide(5, 2), 0.001);
        }

        @Test
        @DisplayName("Negative result")
        void testNegativeDivision() {
            assertEquals(-3.0, calculator.divide(-9, 3), 0.001);
        }

        @Test
        @DisplayName("Division by zero throws exception")
        void testDivisionByZero() {
            assertThrows(ArithmeticException.class, () -> calculator.divide(10, 0));
        }
    }

    @Nested
    @DisplayName("Multiplication Tests")
    class MultiplicationTests {

        @ParameterizedTest
        @CsvSource({
            "0, 100, 0",
            "1, 5, 5",
            "3, 4, 12",
            "-2, 6, -12"
        })
        @DisplayName("Multiply produces correct result")
        void testMultiply(int a, int b, int expected) {
            assertEquals(expected, calculator.multiply(a, b));
        }
    }

    // ============ Conditional Tests ============

    @Test
    @EnabledOnOs(OS.MAC)
    @DisplayName("Runs only on macOS")
    void testOnMacOnly() {
        assertEquals(5, calculator.add(2, 3));
    }

    @Test
    @EnabledForJreRange(min = JRE.JAVA_11)
    @DisplayName("Runs only on JRE 11+")
    void testOnJava11Plus() {
        assertFalse(calculator.isEven(7));
    }

    // ============ Exception Message Assertion ============

    @Test
    @DisplayName("Verify exact exception message")
    void testExceptionMessage() {
        Exception exception = assertThrows(
            ArithmeticException.class,
            () -> calculator.divide(5, 0)
        );
        assertEquals("Cannot divide by zero!", exception.getMessage());
    }

    // ============ Timeout Assertion ============

    @Test
    @Timeout(2) // Fails if test takes more than 2 seconds
    @DisplayName("Add should complete quickly")
    void testAddTimeout() {
        assertEquals(100, calculator.add(50, 50));
    }
}
```

---

## Run Specific Tests

```bash
# Run all tests
mvn test

# Run only AdvancedCalculatorTest
mvn test -Dtest=AdvancedCalculatorTest

# Run only nested class (if supported)
mvn test -Dtest="AdvancedCalculatorTest\$DivisionTests"
```

---

## Advanced JUnit 5 Annotations

| Annotation | Description |
|------------|-------------|
| `@ParameterizedTest` | Run test with multiple input sets |
| `@ValueSource` | Provide simple values (int, String, etc.) |
| `@CsvSource` | Comma-separated value pairs |
| `@MethodSource` | Use a static method to supply arguments |
| `@RepeatedTest` | Run same test N times |
| `@Nested` | Group related tests in inner class |
| `@Timeout` | Fail if test exceeds time limit |
| `@EnabledOnOs` | Run only on specified OS |
| `@Disabled` | Skip a test |
| `Assumptions.assumeTrue()` | Skip (not fail) if condition is false |
