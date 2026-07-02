# Exercise 6 - SLF4J Logging

## Scenario
Implement structured logging in a Spring Boot application using SLF4J with Logback, covering all log levels, MDC context, and logging best practices.

---

## Dependencies (pom.xml)

```xml
<!-- SLF4J is included with spring-boot-starter-web via Logback -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
<!-- Explicit SLF4J API (if needed without Spring Boot) -->
<dependency>
    <groupId>org.slf4j</groupId>
    <artifactId>slf4j-api</artifactId>
    <version>2.0.9</version>
</dependency>
<dependency>
    <groupId>ch.qos.logback</groupId>
    <artifactId>logback-classic</artifactId>
    <version>1.4.11</version>
</dependency>
```

---

## application.properties (Logging Configuration)

```properties
# Set log levels per package
logging.level.root=WARN
logging.level.com.example=DEBUG
logging.level.org.springframework=INFO

# Log to file as well as console
logging.file.name=logs/application.log

# Pattern format
logging.pattern.console=%d{yyyy-MM-dd HH:mm:ss} [%thread] %-5level %logger{36} - %msg%n
logging.pattern.file=%d{yyyy-MM-dd HH:mm:ss} [%thread] %-5level %logger{36} - %msg%n
```

---

## logback-spring.xml (Custom Logback Config)
`src/main/resources/logback-spring.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>

    <!-- Console Appender -->
    <appender name="CONSOLE" class="ch.qos.logback.core.ConsoleAppender">
        <encoder>
            <pattern>%d{HH:mm:ss.SSS} [%thread] %-5level %logger{36} [%X{userId}] - %msg%n</pattern>
        </encoder>
    </appender>

    <!-- Rolling File Appender -->
    <appender name="FILE" class="ch.qos.logback.core.rolling.RollingFileAppender">
        <file>logs/application.log</file>
        <rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
            <fileNamePattern>logs/application.%d{yyyy-MM-dd}.log</fileNamePattern>
            <maxHistory>30</maxHistory>
        </rollingPolicy>
        <encoder>
            <pattern>%d{yyyy-MM-dd HH:mm:ss} [%thread] %-5level %logger{36} - %msg%n</pattern>
        </encoder>
    </appender>

    <!-- Package-level logging -->
    <logger name="com.example" level="DEBUG" additivity="false">
        <appender-ref ref="CONSOLE"/>
        <appender-ref ref="FILE"/>
    </logger>

    <!-- Root logger -->
    <root level="INFO">
        <appender-ref ref="CONSOLE"/>
    </root>

</configuration>
```

---

## LoggingDemoService.java
`src/main/java/com/example/LoggingDemoService.java`

```java
package com.example;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.stereotype.Service;

@Service
public class LoggingDemoService {

    // Create a Logger for this class
    private static final Logger LOGGER = LoggerFactory.getLogger(LoggingDemoService.class);

    /**
     * Demonstrates all SLF4J log levels:
     * TRACE < DEBUG < INFO < WARN < ERROR
     */
    public void demonstrateLogLevels() {
        LOGGER.trace("TRACE: Very fine-grained info — method entry/exit, variable values");
        LOGGER.debug("DEBUG: Diagnostic info useful during development");
        LOGGER.info("INFO:  General application events — service started, request received");
        LOGGER.warn("WARN:  Something unexpected but recoverable — deprecated API, missing config");
        LOGGER.error("ERROR: Something went wrong — exceptions, failures");
    }

    /**
     * Demonstrates parameterized logging (avoids string concatenation cost)
     */
    public void processUser(String userId, String action) {
        LOGGER.info("Processing user: {} with action: {}", userId, action);
        LOGGER.debug("User {} performing {}", userId, action);

        // Avoid this pattern:
        // LOGGER.debug("User " + userId + " doing " + action);  // BAD: always concatenates
    }

    /**
     * Demonstrates exception logging
     */
    public void riskyOperation(int value) {
        LOGGER.info("Start: riskyOperation({})", value);
        try {
            if (value == 0) {
                throw new ArithmeticException("Cannot process zero value!");
            }
            int result = 100 / value;
            LOGGER.debug("Result: {}", result);
        } catch (ArithmeticException e) {
            // Always pass the exception as the LAST argument for stack trace
            LOGGER.error("Error in riskyOperation with value {}: {}", value, e.getMessage(), e);
        }
        LOGGER.info("End: riskyOperation()");
    }

    /**
     * Demonstrates MDC (Mapped Diagnostic Context) for correlation IDs
     */
    public void processWithMDC(String requestId, String userId) {
        // Add context to all log messages in this thread
        MDC.put("requestId", requestId);
        MDC.put("userId", userId);

        try {
            LOGGER.info("Request received");
            LOGGER.debug("Processing request for user");
            performBusinessLogic();
            LOGGER.info("Request completed successfully");
        } finally {
            MDC.clear(); // Always clean up MDC
        }
    }

    private void performBusinessLogic() {
        LOGGER.debug("Executing business logic");
        // All log messages here will automatically include requestId and userId
    }
}
```

---

## LoggingController.java
`src/main/java/com/example/LoggingController.java`

```java
package com.example;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/logs")
public class LoggingController {

    private static final Logger LOGGER = LoggerFactory.getLogger(LoggingController.class);

    @Autowired
    private LoggingDemoService loggingDemoService;

    @GetMapping("/demo")
    public String demonstrateLogs() {
        String requestId = UUID.randomUUID().toString();
        MDC.put("requestId", requestId);

        LOGGER.info("Start: GET /api/logs/demo | requestId={}", requestId);

        loggingDemoService.demonstrateLogLevels();
        loggingDemoService.processUser("user123", "VIEW_DASHBOARD");
        loggingDemoService.riskyOperation(5);
        loggingDemoService.riskyOperation(0); // Will trigger error

        LOGGER.info("End: GET /api/logs/demo");
        MDC.clear();

        return "Logging demonstration complete. Check console/logs folder.";
    }

    @GetMapping("/mdc")
    public String demonstrateMDC(@RequestHeader(value = "X-User-ID", defaultValue = "anonymous") String userId) {
        String requestId = UUID.randomUUID().toString();
        LOGGER.info("MDC demo for user: {} | requestId: {}", userId, requestId);
        loggingDemoService.processWithMDC(requestId, userId);
        return "MDC demonstration complete.";
    }
}
```

---

## SLF4J Log Levels Reference

| Level | When to Use | Example |
|-------|------------|---------|
| `TRACE` | Very fine-grained — method entry/exit | Not recommended in production |
| `DEBUG` | Development-time diagnostics | Variable values, SQL queries |
| `INFO` | Normal business events | Request received, user logged in |
| `WARN` | Recoverable problems | Deprecated usage, slow query |
| `ERROR` | Failures that need attention | Exception, DB unavailable |

---

## SLF4J Best Practices

```java
// ✅ CORRECT: Parameterized logging (lazy evaluation)
LOGGER.debug("User {} logged in at {}", userId, timestamp);

// ❌ WRONG: String concatenation (always executes even if DEBUG is off)
LOGGER.debug("User " + userId + " logged in at " + timestamp);

// ✅ CORRECT: Exception logging with stack trace
LOGGER.error("Failed to process: {}", e.getMessage(), e);

// ❌ WRONG: Loses stack trace
LOGGER.error("Error: " + e.getMessage());

// ✅ CORRECT: Check level before expensive operations
if (LOGGER.isDebugEnabled()) {
    LOGGER.debug("Complex data: {}", expensiveToStringMethod());
}
```
