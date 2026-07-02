# Exercise 3 - Microservices Composite Hands-On

## Scenario
Build a full composite microservices architecture integrating Eureka Service Discovery, API Gateway, multiple microservices (Account, Loan, Customer), inter-service communication via RestTemplate/Feign, and load balancing.

---

## Complete Architecture

```
                        ┌──────────────────────────┐
                        │   Eureka Server (:8761)   │
                        │   Service Registry         │
                        └──────────────────────────┘
                               ↑  ↑  ↑  ↑
                        registers registers registers
                               │  │  │  │
┌──────────────┐   ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌──────────────┐
│ API Gateway  │   │  account  │ │  loan    │ │ customer  │ │   greet      │
│  (:9090)     │   │  (:8080)  │ │  (:8081)  │ │  (:8082)  │ │  (:8083)     │
│  LogFilter   │   └───────────┘ └───────────┘ └───────────┘ └──────────────┘
│  Load Bal.   │
└──────────────┘
       ↑
     Client
```

---

## Customer Microservice (calls Account + Loan via Feign)

### pom.xml (Feign dependency)
```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-openfeign</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
</dependency>
```

### CustomerApplication.java
```java
package com.cognizant.customer;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class CustomerApplication {
    public static void main(String[] args) {
        SpringApplication.run(CustomerApplication.class, args);
    }
}
```

### AccountClient.java (Feign Client for Account Service)
```java
package com.cognizant.customer.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.Map;

@FeignClient(name = "account-service")  // matches spring.application.name in account service
public interface AccountClient {

    @GetMapping("/accounts/{number}")
    Map<String, Object> getAccount(@PathVariable("number") String number);
}
```

### LoanClient.java (Feign Client for Loan Service)
```java
package com.cognizant.customer.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.Map;

@FeignClient(name = "loan-service")
public interface LoanClient {

    @GetMapping("/loans/{number}")
    Map<String, Object> getLoan(@PathVariable("number") String number);
}
```

### CustomerController.java
```java
package com.cognizant.customer;

import com.cognizant.customer.client.AccountClient;
import com.cognizant.customer.client.LoanClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/customers")
public class CustomerController {

    private static final Logger LOGGER = LoggerFactory.getLogger(CustomerController.class);

    @Autowired
    private AccountClient accountClient;

    @Autowired
    private LoanClient loanClient;

    /**
     * GET /customers/{id}
     * Returns a composite view: customer info + their account + their loan
     */
    @GetMapping("/{id}")
    public Map<String, Object> getCustomerDetails(@PathVariable String id) {
        LOGGER.info("Fetching composite details for customer: {}", id);

        Map<String, Object> response = new HashMap<>();

        // Customer base info (hardcoded for demo)
        response.put("customerId", id);
        response.put("name", "John Doe");
        response.put("email", "john.doe@example.com");

        // Call Account Service via Feign (Eureka handles service discovery)
        try {
            Map<String, Object> account = accountClient.getAccount("00987987973432");
            response.put("account", account);
            LOGGER.debug("Account fetched: {}", account);
        } catch (Exception e) {
            LOGGER.error("Failed to fetch account: {}", e.getMessage());
            response.put("account", "Service unavailable");
        }

        // Call Loan Service via Feign
        try {
            Map<String, Object> loan = loanClient.getLoan("H00987987972342");
            response.put("loan", loan);
            LOGGER.debug("Loan fetched: {}", loan);
        } catch (Exception e) {
            LOGGER.error("Failed to fetch loan: {}", e.getMessage());
            response.put("loan", "Service unavailable");
        }

        return response;
    }
}
```

### customer/application.properties
```properties
spring.application.name=customer-service
server.port=8082

eureka.client.service-url.defaultZone=http://localhost:8761/eureka/

# Feign timeout settings
feign.client.config.default.connectTimeout=5000
feign.client.config.default.readTimeout=5000
```

---

## Load Balancing Configuration

For multiple instances of account-service:

```bash
# Start 2 instances of account service on different ports
mvn spring-boot:run -Dspring-boot.run.arguments=--server.port=8080
mvn spring-boot:run -Dspring-boot.run.arguments=--server.port=8085
```

Feign automatically load-balances between registered instances via Eureka.

---

## API Gateway with Manual Routes

### api-gateway/application.yml (complete routing)
```yaml
spring:
  application:
    name: api-gateway
  cloud:
    gateway:
      discovery:
        locator:
          enabled: true
          lower-case-service-id: true
      routes:
        - id: account-service
          uri: lb://account-service
          predicates:
            - Path=/account-service/**
          filters:
            - StripPrefix=1

        - id: loan-service
          uri: lb://loan-service
          predicates:
            - Path=/loan-service/**
          filters:
            - StripPrefix=1

        - id: customer-service
          uri: lb://customer-service
          predicates:
            - Path=/customer-service/**
          filters:
            - StripPrefix=1

        - id: greet-service
          uri: lb://greet-service
          predicates:
            - Path=/greet-service/**
          filters:
            - StripPrefix=1

server:
  port: 9090

eureka:
  client:
    service-url:
      defaultZone: http://localhost:8761/eureka/
```

---

## Complete Startup & Test Script

```bash
#!/bin/bash
# Start all services in correct order

echo "Starting Eureka Server..."
cd eureka-discovery-server && mvn spring-boot:run &
sleep 20

echo "Starting Microservices..."
cd account && mvn spring-boot:run &
cd loan && mvn spring-boot:run &
cd greet-service && mvn spring-boot:run &
sleep 15

echo "Starting Customer Service (Feign)..."
cd customer && mvn spring-boot:run &
sleep 10

echo "Starting API Gateway..."
cd api-gateway && mvn spring-boot:run &
sleep 10

echo "All services started!"

# Test routes
echo "\n=== Testing via API Gateway ==="
curl http://localhost:9090/greet-service/greet
curl http://localhost:9090/account-service/accounts/00987987973432
curl http://localhost:9090/loan-service/loans/H00987987972342
curl http://localhost:9090/customer-service/customers/C001
```

---

## Summary of All Services

| Service | Port | Purpose | Eureka Registered |
|---------|------|---------|-------------------|
| eureka-discovery-server | 8761 | Service Registry | No (is the server) |
| greet-service | 8082 | Simple greeting | Yes |
| account-service | 8080 | Account data | Yes |
| loan-service | 8081 | Loan data | Yes |
| customer-service | 8083 | Composite (calls account + loan) | Yes |
| api-gateway | 9090 | Single entry point | Yes |
```