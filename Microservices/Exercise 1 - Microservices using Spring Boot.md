# Exercise 1 - Microservices using Spring Boot

## Scenario
Create two independent microservices: Account Service and Loan Service, running on different ports.

---

## Account Microservice

### Project Setup (start.spring.io)
- **Group**: `com.cognizant`
- **Artifact**: `account`
- **Dependencies**: Spring Web, Spring Boot DevTools

### AccountController.java
`account/src/main/java/com/cognizant/account/AccountController.java`

```java
package com.cognizant.account;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
public class AccountController {

    private static final Logger LOGGER = LoggerFactory.getLogger(AccountController.class);

    /**
     * GET /accounts/{number}
     * Returns account details for a given account number.
     */
    @GetMapping("/accounts/{number}")
    public Map<String, Object> getAccount(@PathVariable String number) {
        LOGGER.info("GET /accounts/{}", number);

        // Simulated account data (in real app: fetch from DB)
        Map<String, Object> account = new HashMap<>();
        account.put("number", number);
        account.put("type", "savings");
        account.put("balance", 234343);
        account.put("currency", "INR");
        account.put("holder", "John Doe");

        LOGGER.debug("Returning account: {}", account);
        return account;
    }

    @GetMapping("/accounts")
    public Map<String, Object> getAllAccounts() {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Account Service is running!");
        response.put("service", "account-service");
        response.put("port", 8080);
        return response;
    }
}
```

### account/src/main/resources/application.properties
```properties
spring.application.name=account-service
server.port=8080
logging.level.com.cognizant=DEBUG
```

---

## Loan Microservice

### LoanController.java
`loan/src/main/java/com/cognizant/loan/LoanController.java`

```java
package com.cognizant.loan;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
public class LoanController {

    private static final Logger LOGGER = LoggerFactory.getLogger(LoanController.class);

    /**
     * GET /loans/{number}
     * Returns loan details for a given loan number.
     */
    @GetMapping("/loans/{number}")
    public Map<String, Object> getLoan(@PathVariable String number) {
        LOGGER.info("GET /loans/{}", number);

        // Simulated loan data
        Map<String, Object> loan = new HashMap<>();
        loan.put("number", number);
        loan.put("type", "car");
        loan.put("loan", 400000);
        loan.put("emi", 3258);
        loan.put("tenure", 18);
        loan.put("currency", "INR");
        loan.put("borrower", "John Doe");

        return loan;
    }

    @GetMapping("/loans")
    public Map<String, Object> getAllLoans() {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Loan Service is running!");
        response.put("service", "loan-service");
        response.put("port", 8081);
        return response;
    }
}
```

### loan/src/main/resources/application.properties
```properties
spring.application.name=loan-service
server.port=8081
logging.level.com.cognizant=DEBUG
```

---

## Main Application Classes

### AccountApplication.java
```java
package com.cognizant.account;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class AccountApplication {
    public static void main(String[] args) {
        SpringApplication.run(AccountApplication.class, args);
        System.out.println("Account Service started on port 8080");
    }
}
```

### LoanApplication.java
```java
package com.cognizant.loan;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class LoanApplication {
    public static void main(String[] args) {
        SpringApplication.run(LoanApplication.class, args);
        System.out.println("Loan Service started on port 8081");
    }
}
```

---

## Build & Run

```bash
# Terminal 1: Start Account Service
cd account
mvn spring-boot:run

# Terminal 2: Start Loan Service
cd loan
mvn spring-boot:run
```

---

## Test Services

```bash
# Test Account Service
curl http://localhost:8080/accounts/00987987973432
# Response: {"number":"00987987973432","type":"savings","balance":234343,...}

# Test Loan Service
curl http://localhost:8081/loans/H00987987972342
# Response: {"number":"H00987987972342","type":"car","loan":400000,"emi":3258,"tenure":18}

# Service health check
curl http://localhost:8080/accounts
curl http://localhost:8081/loans
```

---

## Architecture

```
Client
  ├── → http://localhost:8080/accounts/{num}  → Account Microservice (Port 8080)
  └── → http://localhost:8081/loans/{num}     → Loan Microservice (Port 8081)

Both services:
  - Run independently
  - Have separate JVMs / codebases
  - Can be deployed and scaled independently
  - Communicate data in JSON format
```

---

## Key Microservice Principles Applied

| Principle | Implementation |
|-----------|----------------|
| **Single Responsibility** | Account service handles only accounts |
| **Independent Deployment** | Each service runs as a separate Spring Boot JAR |
| **Separate Ports** | Account: 8080, Loan: 8081 |
| **Loose Coupling** | Services don't directly call each other (yet) |
| **API Contract** | Well-defined REST endpoints |
