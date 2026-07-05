# Exercise 4 - Spring REST Security with HTTP Basic Authentication

## Scenario
Secure REST API endpoints using Spring Security with HTTP Basic Authentication and role-based access control.

---

## Add Spring Security Dependency

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>
```

---

## SecurityConfig.java
`src/main/java/com/cognizant/springlearn/security/SecurityConfig.java`

```java
package com.cognizant.springlearn.security;

import org.springframework.context.annotation.*;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.*;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    /**
     * Define in-memory users with roles
     */
    @Bean
    public UserDetailsService userDetailsService(PasswordEncoder encoder) {
        UserDetails user = User.builder()
            .username("user")
            .password(encoder.encode("pwd"))
            .roles("USER")
            .build();

        UserDetails admin = User.builder()
            .username("admin")
            .password(encoder.encode("admin123"))
            .roles("ADMIN", "USER")
            .build();

        return new InMemoryUserDetailsManager(user, admin);
    }

    /**
     * BCrypt password encoder
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * HTTP Security configuration
     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .httpBasic(httpBasic -> {}) // Enable HTTP Basic Auth
            .authorizeHttpRequests(auth -> auth
                // Allow H2 console without auth
                .requestMatchers("/h2-console/**").permitAll()
                // Only ADMIN can add/update/delete
                .requestMatchers(org.springframework.http.HttpMethod.POST, "/countries").hasRole("ADMIN")
                .requestMatchers(org.springframework.http.HttpMethod.PUT, "/countries/**").hasRole("ADMIN")
                .requestMatchers(org.springframework.http.HttpMethod.DELETE, "/countries/**").hasRole("ADMIN")
                // USER and ADMIN can GET
                .requestMatchers(org.springframework.http.HttpMethod.GET, "/countries/**").hasAnyRole("USER", "ADMIN")
                // /authenticate endpoint
                .requestMatchers("/authenticate").hasAnyRole("USER", "ADMIN")
                .anyRequest().authenticated()
            )
            // Required for H2 console frames
            .headers(headers -> headers.frameOptions(frame -> frame.sameOrigin()));

        return http.build();
    }
}
```

---

## application.properties

```properties
server.port=8090
spring.application.name=springlearn

# Disable default security user (we define our own)
# spring.security.user.name=user
# spring.security.user.password=pwd

logging.level.com.cognizant=DEBUG
logging.level.org.springframework.security=DEBUG
```

---

## AuthenticationController.java
`src/main/java/com/cognizant/springlearn/controller/AuthenticationController.java`

```java
package com.cognizant.springlearn.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
public class AuthenticationController {

    private static final Logger LOGGER = LoggerFactory.getLogger(AuthenticationController.class);

    /**
     * GET /authenticate
     * Protected by Basic Auth — returns confirmation if credentials are valid.
     * Called with: curl -u user:pwd http://localhost:8090/authenticate
     */
    @GetMapping("/authenticate")
    public Map<String, String> authenticate() {
        LOGGER.info("Authentication successful.");
        Map<String, String> response = new HashMap<>();
        response.put("status", "authenticated");
        response.put("message", "Credentials are valid. Access granted.");
        return response;
    }
}
```

---

## Test with cURL

```bash
# GET countries (requires USER or ADMIN role)
curl -u user:pwd http://localhost:8090/countries

# GET specific country
curl -u user:pwd http://localhost:8090/countries/IN

# POST (requires ADMIN role)
curl -u admin:admin123 -X POST http://localhost:8090/countries \
  -H "Content-Type: application/json" \
  -d '{"code":"AU","name":"Australia","capital":"Canberra","population":26000000}'

# Try POST with USER role (should get 403 Forbidden)
curl -u user:pwd -X POST http://localhost:8090/countries \
  -H "Content-Type: application/json" \
  -d '{"code":"AU","name":"Australia","capital":"Canberra","population":26000000}'

# Authenticate endpoint
curl -u user:pwd http://localhost:8090/authenticate

# No credentials (should get 401 Unauthorized)
curl http://localhost:8090/countries
```

---

## HTTP Status Codes

| Code | Meaning | When Returned |
|------|---------|---------------|
| `200 OK` | Success | Valid request with credentials |
| `401 Unauthorized` | No/wrong credentials | Missing or invalid Basic Auth |
| `403 Forbidden` | Insufficient role | Valid credentials, wrong role |
