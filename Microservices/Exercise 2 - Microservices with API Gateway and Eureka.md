# Exercise 2 - Microservices with API Gateway and Eureka

## Scenario
Set up a Eureka Discovery Server, register the microservices, and create an API Gateway with a global logging filter.

---

## Architecture

```
Browser/Client
      ↓
API Gateway (Port 9090)          ← Global Log Filter
      ↓
Eureka Server (Port 8761)        ← Service Registry
      ↓
┌──────────────────────────────────────┐
│  greet-service (Port 8082)           │
│  account-service (Port 8080)         │
│  loan-service (Port 8081)            │
└──────────────────────────────────────┘
```

---

## 1. Eureka Discovery Server

### Project Setup
- **Artifact**: `eureka-discovery-server`
- **Dependencies**: Eureka Server

### EurekaDiscoveryServerApplication.java
```java
package com.cognizant.eureka;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.server.EnableEurekaServer;

@SpringBootApplication
@EnableEurekaServer
public class EurekaDiscoveryServerApplication {
    public static void main(String[] args) {
        SpringApplication.run(EurekaDiscoveryServerApplication.class, args);
    }
}
```

### eureka-server/application.properties
```properties
server.port=8761

# Don't register the server itself as a client
eureka.client.register-with-eureka=false
eureka.client.fetch-registry=false

logging.level.com.netflix.eureka=OFF
logging.level.com.netflix.discovery=OFF

spring.application.name=eureka-discovery-server
```

---

## 2. Greet Microservice (registers with Eureka)

### GreetController.java
```java
package com.cognizant.greet;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class GreetController {

    @GetMapping("/greet")
    public String greet() {
        return "Hello World from Greet Service!";
    }
}
```

### greet-service/application.properties
```properties
spring.application.name=greet-service
server.port=8082

# Register with Eureka
eureka.client.service-url.defaultZone=http://localhost:8761/eureka/
```

### greet-service/pom.xml (key dependencies)
```xml
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
    </dependency>
</dependencies>

<dependencyManagement>
    <dependencies>
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-dependencies</artifactId>
            <version>2023.0.0</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
    </dependencies>
</dependencyManagement>
```

---

## 3. API Gateway

### Project Setup
- **Artifact**: `api-gateway`
- **Dependencies**: Spring Cloud Gateway, Eureka Discovery Client

### api-gateway/application.properties
```properties
spring.application.name=api-gateway
server.port=9090

# Register with Eureka
eureka.client.service-url.defaultZone=http://localhost:8761/eureka/

# Allow service names in lowercase in URL
spring.cloud.gateway.discovery.locator.enabled=true
spring.cloud.gateway.discovery.locator.lower-case-service-id=true

# Manual route definitions (optional, more control)
spring.cloud.gateway.routes[0].id=greet-service
spring.cloud.gateway.routes[0].uri=lb://greet-service
spring.cloud.gateway.routes[0].predicates[0]=Path=/greet-service/**
spring.cloud.gateway.routes[0].filters[0]=StripPrefix=1
```

### LogFilter.java (Global Filter)
`api-gateway/src/main/java/com/cognizant/gateway/LogFilter.java`

```java
package com.cognizant.gateway;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@Component
public class LogFilter implements GlobalFilter, Ordered {

    private static final Logger LOGGER = LoggerFactory.getLogger(LogFilter.class);

    /**
     * This filter intercepts ALL requests passing through the API Gateway.
     */
    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();

        LOGGER.info("=== API Gateway Request ===");
        LOGGER.info("Method  : {}", request.getMethod());
        LOGGER.info("URI     : {}", request.getURI());
        LOGGER.info("Path    : {}", request.getPath());
        LOGGER.info("Headers : {}", request.getHeaders());

        return chain.filter(exchange)
            .then(Mono.fromRunnable(() -> {
                LOGGER.info("=== Response Status: {} ===",
                    exchange.getResponse().getStatusCode());
            }));
    }

    @Override
    public int getOrder() {
        return -1; // Highest priority (runs first)
    }
}
```

### ApiGatewayApplication.java
```java
package com.cognizant.gateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ApiGatewayApplication {
    public static void main(String[] args) {
        SpringApplication.run(ApiGatewayApplication.class, args);
    }
}
```

---

## Startup Order

```bash
# 1. Start Eureka Discovery Server first
cd eureka-discovery-server && mvn spring-boot:run

# 2. Start Greet Service (waits ~30s to register with Eureka)
cd greet-service && mvn spring-boot:run

# 3. Start API Gateway
cd api-gateway && mvn spring-boot:run
```

---

## Test the API Gateway

```bash
# Access greet-service DIRECTLY
curl http://localhost:8082/greet

# Access greet-service THROUGH the gateway (recommended)
curl http://localhost:9090/greet-service/greet

# Check Eureka Registry
open http://localhost:8761
# "Instances currently registered with Eureka" should show:
# - GREET-SERVICE
# - API-GATEWAY
```

---

## Eureka Flow

```
1. greet-service starts → registers itself with eureka-server
2. api-gateway starts → registers with eureka-server + fetches registry
3. Client → GET http://localhost:9090/greet-service/greet
4. API Gateway → looks up "greet-service" in Eureka registry
5. API Gateway → forwards request to greet-service instance
6. LogFilter → logs every step
7. Response returned to client
```
