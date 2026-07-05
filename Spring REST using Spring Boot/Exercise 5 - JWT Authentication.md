# Exercise 5 - JWT Authentication

## Scenario
Implement JWT (JSON Web Token) based authentication where clients get a token on login and use it for all subsequent requests.

---

## Add JWT Dependency

```xml
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt</artifactId>
    <version>0.9.0</version>
</dependency>
```

---

## JWT Flow

```
1. Client → POST /authenticate (username:password in Basic Auth header)
2. Server validates credentials → generates JWT token
3. Server → responds with token
4. Client → subsequent requests include: Authorization: Bearer <token>
5. Server → validates JWT on every request via JwtAuthorizationFilter
```

---

## AuthenticationController.java
`src/main/java/com/cognizant/springlearn/controller/AuthenticationController.java`

```java
package com.cognizant.springlearn.controller;

import io.jsonwebtoken.JwtBuilder;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@RestController
public class AuthenticationController {

    private static final Logger LOGGER = LoggerFactory.getLogger(AuthenticationController.class);

    private static final String SECRET_KEY = "secretkey";
    private static final long TOKEN_VALIDITY_MS = 1_200_000; // 20 minutes

    /**
     * GET /authenticate
     * Client sends credentials in Basic Auth header.
     * Returns a JWT token.
     *
     * Example: curl -u user:pwd http://localhost:8090/authenticate
     */
    @GetMapping("/authenticate")
    public Map<String, String> authenticate(
            @RequestHeader("Authorization") String authHeader) {
        LOGGER.info("Start: authenticate()");

        String user = getUser(authHeader);
        LOGGER.debug("Authenticated user: {}", user);

        String token = generateJwt(user);
        LOGGER.debug("Generated token: {}", token);

        Map<String, String> response = new HashMap<>();
        response.put("token", token);
        response.put("user", user);

        LOGGER.info("End: authenticate()");
        return response;
    }

    /**
     * Decode the Basic Auth header to extract username.
     * Authorization: Basic base64(username:password)
     */
    private String getUser(String authHeader) {
        LOGGER.info("Start: getUser()");
        // Remove "Basic " prefix
        String encodedCredentials = authHeader.substring("Basic ".length());
        // Decode from Base64
        byte[] decodedBytes = Base64.getDecoder().decode(encodedCredentials);
        String credentials = new String(decodedBytes);
        // Extract username (text before ":")
        String user = credentials.substring(0, credentials.indexOf(":"));
        LOGGER.debug("Extracted user: {}", user);
        return user;
    }

    /**
     * Generate a JWT token for the given user.
     */
    private String generateJwt(String user) {
        LOGGER.info("Start: generateJwt()");
        JwtBuilder builder = Jwts.builder();
        builder.setSubject(user);
        builder.setIssuedAt(new Date());
        builder.setExpiration(new Date(System.currentTimeMillis() + TOKEN_VALIDITY_MS));
        builder.signWith(SignatureAlgorithm.HS256, SECRET_KEY);
        String token = builder.compact();
        LOGGER.debug("Token generated for user: {}", user);
        return token;
    }
}
```

---

## JwtAuthorizationFilter.java
`src/main/java/com/cognizant/springlearn/security/JwtAuthorizationFilter.java`

```java
package com.cognizant.springlearn.security;

import io.jsonwebtoken.*;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.*;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;

import java.io.IOException;
import java.util.ArrayList;

public class JwtAuthorizationFilter extends BasicAuthenticationFilter {

    private static final Logger LOGGER = LoggerFactory.getLogger(JwtAuthorizationFilter.class);
    private static final String SECRET_KEY = "secretkey";

    public JwtAuthorizationFilter(AuthenticationManager authenticationManager) {
        super(authenticationManager);
        LOGGER.info("JwtAuthorizationFilter initialized.");
        LOGGER.debug("AuthenticationManager: {}", authenticationManager);
    }

    /**
     * Called for every request. If Authorization header starts with "Bearer ",
     * validate the JWT and set authentication in the security context.
     */
    @Override
    protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res,
            FilterChain chain) throws IOException, ServletException {
        LOGGER.info("Start: doFilterInternal()");

        String header = req.getHeader("Authorization");
        LOGGER.debug("Authorization header: {}", header);

        // Pass through if no Bearer token
        if (header == null || !header.startsWith("Bearer ")) {
            chain.doFilter(req, res);
            return;
        }

        UsernamePasswordAuthenticationToken authentication = getAuthentication(req);
        SecurityContextHolder.getContext().setAuthentication(authentication);

        chain.doFilter(req, res);
        LOGGER.info("End: doFilterInternal()");
    }

    /**
     * Parse and validate the JWT from the Authorization header.
     */
    private UsernamePasswordAuthenticationToken getAuthentication(HttpServletRequest request) {
        String token = request.getHeader("Authorization");
        if (token != null) {
            try {
                Jws<Claims> jws = Jwts.parser()
                    .setSigningKey(SECRET_KEY)
                    .parseClaimsJws(token.replace("Bearer ", ""));

                String user = jws.getBody().getSubject();
                LOGGER.debug("Token valid for user: {}", user);

                if (user != null) {
                    return new UsernamePasswordAuthenticationToken(
                        user, null, new ArrayList<>()
                    );
                }
            } catch (JwtException ex) {
                LOGGER.warn("JWT validation failed: {}", ex.getMessage());
                return null;
            }
        }
        return null;
    }
}
```

---

## Updated SecurityConfig.java (with JWT Filter)

```java
package com.cognizant.springlearn.security;

import org.springframework.context.annotation.*;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
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

    @Bean
    public UserDetailsService userDetailsService(PasswordEncoder encoder) {
        UserDetails user = User.builder()
            .username("user")
            .password(encoder.encode("pwd"))
            .roles("USER")
            .build();
        return new InMemoryUserDetailsManager(user);
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain filterChain(
            HttpSecurity http,
            AuthenticationManager authManager) throws Exception {

        http.csrf(csrf -> csrf.disable())
            .httpBasic(httpBasic -> {})
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/authenticate").hasAnyRole("USER", "ADMIN")
                .anyRequest().authenticated()
            )
            // Add the JWT authorization filter
            .addFilter(new JwtAuthorizationFilter(authManager));

        return http.build();
    }
}
```

---

## Test JWT Flow

```bash
# Step 1: Authenticate and get token
curl -s -u user:pwd http://localhost:8090/authenticate
# Response: {"token":"eyJhbGciOiJIUzI1NiJ9...","user":"user"}

# Step 2: Use token for subsequent requests (replace TOKEN with actual token)
curl -s -H "Authorization: Bearer TOKEN_HERE" http://localhost:8090/countries

# Step 3: Test with invalid token (should get 401/403)
curl -s -H "Authorization: Bearer invalidtoken" http://localhost:8090/countries
```

---

## JWT Structure

```
Header.Payload.Signature
eyJhbGciOiJIUzI1NiJ9 . eyJzdWIiOiJ1c2VyIiwiaWF0IjoxNzA...} . signatureHash
      ↑                           ↑                                    ↑
   Algorithm                  Claims (user, iat, exp)            HMAC-SHA256
```
# Exercise 5 - JWT Authentication

## Scenario
Implement JWT (JSON Web Token) based authentication where clients get a token on login and use it for all subsequent requests.

---

## Add JWT Dependency

```xml
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt</artifactId>
    <version>0.9.0</version>
</dependency>
```

---

## JWT Flow

```
1. Client → POST /authenticate (username:password in Basic Auth header)
2. Server validates credentials → generates JWT token
3. Server → responds with token
4. Client → subsequent requests include: Authorization: Bearer <token>
5. Server → validates JWT on every request via JwtAuthorizationFilter
```

---

## AuthenticationController.java
`src/main/java/com/cognizant/springlearn/controller/AuthenticationController.java`

```java
package com.cognizant.springlearn.controller;

import io.jsonwebtoken.JwtBuilder;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@RestController
public class AuthenticationController {

    private static final Logger LOGGER = LoggerFactory.getLogger(AuthenticationController.class);

    private static final String SECRET_KEY = "secretkey";
    private static final long TOKEN_VALIDITY_MS = 1_200_000; // 20 minutes

    /**
     * GET /authenticate
     * Client sends credentials in Basic Auth header.
     * Returns a JWT token.
     *
     * Example: curl -u user:pwd http://localhost:8090/authenticate
     */
    @GetMapping("/authenticate")
    public Map<String, String> authenticate(
            @RequestHeader("Authorization") String authHeader) {
        LOGGER.info("Start: authenticate()");

        String user = getUser(authHeader);
        LOGGER.debug("Authenticated user: {}", user);

        String token = generateJwt(user);
        LOGGER.debug("Generated token: {}", token);

        Map<String, String> response = new HashMap<>();
        response.put("token", token);
        response.put("user", user);

        LOGGER.info("End: authenticate()");
        return response;
    }

    /**
     * Decode the Basic Auth header to extract username.
     * Authorization: Basic base64(username:password)
     */
    private String getUser(String authHeader) {
        LOGGER.info("Start: getUser()");
        // Remove "Basic " prefix
        String encodedCredentials = authHeader.substring("Basic ".length());
        // Decode from Base64
        byte[] decodedBytes = Base64.getDecoder().decode(encodedCredentials);
        String credentials = new String(decodedBytes);
        // Extract username (text before ":")
        String user = credentials.substring(0, credentials.indexOf(":"));
        LOGGER.debug("Extracted user: {}", user);
        return user;
    }

    /**
     * Generate a JWT token for the given user.
     */
    private String generateJwt(String user) {
        LOGGER.info("Start: generateJwt()");
        JwtBuilder builder = Jwts.builder();
        builder.setSubject(user);
        builder.setIssuedAt(new Date());
        builder.setExpiration(new Date(System.currentTimeMillis() + TOKEN_VALIDITY_MS));
        builder.signWith(SignatureAlgorithm.HS256, SECRET_KEY);
        String token = builder.compact();
        LOGGER.debug("Token generated for user: {}", user);
        return token;
    }
}
```

---

## JwtAuthorizationFilter.java
`src/main/java/com/cognizant/springlearn/security/JwtAuthorizationFilter.java`

```java
package com.cognizant.springlearn.security;

import io.jsonwebtoken.*;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.*;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;

import java.io.IOException;
import java.util.ArrayList;

public class JwtAuthorizationFilter extends BasicAuthenticationFilter {

    private static final Logger LOGGER = LoggerFactory.getLogger(JwtAuthorizationFilter.class);
    private static final String SECRET_KEY = "secretkey";

    public JwtAuthorizationFilter(AuthenticationManager authenticationManager) {
        super(authenticationManager);
        LOGGER.info("JwtAuthorizationFilter initialized.");
        LOGGER.debug("AuthenticationManager: {}", authenticationManager);
    }

    /**
     * Called for every request. If Authorization header starts with "Bearer ",
     * validate the JWT and set authentication in the security context.
     */
    @Override
    protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res,
            FilterChain chain) throws IOException, ServletException {
        LOGGER.info("Start: doFilterInternal()");

        String header = req.getHeader("Authorization");
        LOGGER.debug("Authorization header: {}", header);

        // Pass through if no Bearer token
        if (header == null || !header.startsWith("Bearer ")) {
            chain.doFilter(req, res);
            return;
        }

        UsernamePasswordAuthenticationToken authentication = getAuthentication(req);
        SecurityContextHolder.getContext().setAuthentication(authentication);

        chain.doFilter(req, res);
        LOGGER.info("End: doFilterInternal()");
    }

    /**
     * Parse and validate the JWT from the Authorization header.
     */
    private UsernamePasswordAuthenticationToken getAuthentication(HttpServletRequest request) {
        String token = request.getHeader("Authorization");
        if (token != null) {
            try {
                Jws<Claims> jws = Jwts.parser()
                    .setSigningKey(SECRET_KEY)
                    .parseClaimsJws(token.replace("Bearer ", ""));

                String user = jws.getBody().getSubject();
                LOGGER.debug("Token valid for user: {}", user);

                if (user != null) {
                    return new UsernamePasswordAuthenticationToken(
                        user, null, new ArrayList<>()
                    );
                }
            } catch (JwtException ex) {
                LOGGER.warn("JWT validation failed: {}", ex.getMessage());
                return null;
            }
        }
        return null;
    }
}
```

---

## Updated SecurityConfig.java (with JWT Filter)

```java
package com.cognizant.springlearn.security;

import org.springframework.context.annotation.*;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
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

    @Bean
    public UserDetailsService userDetailsService(PasswordEncoder encoder) {
        UserDetails user = User.builder()
            .username("user")
            .password(encoder.encode("pwd"))
            .roles("USER")
            .build();
        return new InMemoryUserDetailsManager(user);
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain filterChain(
            HttpSecurity http,
            AuthenticationManager authManager) throws Exception {

        http.csrf(csrf -> csrf.disable())
            .httpBasic(httpBasic -> {})
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/authenticate").hasAnyRole("USER", "ADMIN")
                .anyRequest().authenticated()
            )
            // Add the JWT authorization filter
            .addFilter(new JwtAuthorizationFilter(authManager));

        return http.build();
    }
}
```

---

## Test JWT Flow

```bash
# Step 1: Authenticate and get token
curl -s -u user:pwd http://localhost:8090/authenticate
# Response: {"token":"eyJhbGciOiJIUzI1NiJ9...","user":"user"}

# Step 2: Use token for subsequent requests (replace TOKEN with actual token)
curl -s -H "Authorization: Bearer TOKEN_HERE" http://localhost:8090/countries

# Step 3: Test with invalid token (should get 401/403)
curl -s -H "Authorization: Bearer invalidtoken" http://localhost:8090/countries
```

---

## JWT Structure

```
Header.Payload.Signature
eyJhbGciOiJIUzI1NiJ9 . eyJzdWIiOiJ1c2VyIiwiaWF0IjoxNzA...} . signatureHash
      ↑                           ↑                                    ↑
   Algorithm                  Claims (user, iat, exp)            HMAC-SHA256
```
