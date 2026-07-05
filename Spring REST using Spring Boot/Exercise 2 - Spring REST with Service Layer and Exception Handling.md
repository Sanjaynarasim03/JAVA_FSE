# Exercise 2 - Spring REST with Service Layer and Exception Handling

## Scenario
Add a proper service layer, global exception handling, and structured error responses.

---

## CountryNotFoundException.java
`src/main/java/com/cognizant/springlearn/exception/CountryNotFoundException.java`

```java
package com.cognizant.springlearn.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class CountryNotFoundException extends RuntimeException {

    public CountryNotFoundException(String code) {
        super("Country not found with code: " + code);
    }
}
```

---

## ErrorResponse.java
`src/main/java/com/cognizant/springlearn/exception/ErrorResponse.java`

```java
package com.cognizant.springlearn.exception;

import java.time.LocalDateTime;

public class ErrorResponse {

    private int status;
    private String message;
    private LocalDateTime timestamp;

    public ErrorResponse(int status, String message) {
        this.status = status;
        this.message = message;
        this.timestamp = LocalDateTime.now();
    }

    public int getStatus() { return status; }
    public String getMessage() { return message; }
    public LocalDateTime getTimestamp() { return timestamp; }
}
```

---

## GlobalExceptionHandler.java
`src/main/java/com/cognizant/springlearn/exception/GlobalExceptionHandler.java`

```java
package com.cognizant.springlearn.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(CountryNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleCountryNotFound(CountryNotFoundException ex) {
        ErrorResponse error = new ErrorResponse(
            HttpStatus.NOT_FOUND.value(),
            ex.getMessage()
        );
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGeneral(Exception ex) {
        ErrorResponse error = new ErrorResponse(
            HttpStatus.INTERNAL_SERVER_ERROR.value(),
            "An unexpected error occurred: " + ex.getMessage()
        );
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }
}
```

---

## CountryService.java
`src/main/java/com/cognizant/springlearn/service/CountryService.java`

```java
package com.cognizant.springlearn.service;

import com.cognizant.springlearn.exception.CountryNotFoundException;
import com.cognizant.springlearn.model.Country;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class CountryService {

    private static final Logger LOGGER = LoggerFactory.getLogger(CountryService.class);

    // Simulated in-memory storage
    private final Map<String, Country> countryMap = new HashMap<>();

    public CountryService() {
        // Initialize with sample data
        countryMap.put("IN", new Country("IN", "India", "New Delhi", 1_400_000_000L));
        countryMap.put("US", new Country("US", "United States", "Washington D.C.", 330_000_000L));
        countryMap.put("GB", new Country("GB", "United Kingdom", "London", 67_000_000L));
        countryMap.put("DE", new Country("DE", "Germany", "Berlin", 83_000_000L));
        countryMap.put("JP", new Country("JP", "Japan", "Tokyo", 126_000_000L));
    }

    public List<Country> getAllCountries() {
        LOGGER.info("CountryService: getAllCountries()");
        return new ArrayList<>(countryMap.values());
    }

    public Country getCountryByCode(String code) {
        LOGGER.info("CountryService: getCountryByCode({})", code);
        Country country = countryMap.get(code.toUpperCase());
        if (country == null) {
            LOGGER.warn("Country not found: {}", code);
            throw new CountryNotFoundException(code);
        }
        return country;
    }

    public Country addCountry(Country country) {
        LOGGER.info("CountryService: addCountry({})", country.getCode());
        countryMap.put(country.getCode().toUpperCase(), country);
        return country;
    }

    public Country updateCountry(String code, Country updated) {
        LOGGER.info("CountryService: updateCountry({})", code);
        if (!countryMap.containsKey(code.toUpperCase())) {
            throw new CountryNotFoundException(code);
        }
        updated.setCode(code.toUpperCase());
        countryMap.put(code.toUpperCase(), updated);
        return updated;
    }

    public void deleteCountry(String code) {
        LOGGER.info("CountryService: deleteCountry({})", code);
        if (!countryMap.containsKey(code.toUpperCase())) {
            throw new CountryNotFoundException(code);
        }
        countryMap.remove(code.toUpperCase());
    }
}
```

---

## CountryController.java (Updated with Service Layer)

```java
package com.cognizant.springlearn.controller;

import com.cognizant.springlearn.model.Country;
import com.cognizant.springlearn.service.CountryService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class CountryController {

    private static final Logger LOGGER = LoggerFactory.getLogger(CountryController.class);

    @Autowired
    private CountryService countryService;

    @GetMapping("/countries")
    public List<Country> getAllCountries() {
        LOGGER.info("GET /countries");
        return countryService.getAllCountries();
    }

    @GetMapping("/countries/{code}")
    public Country getCountryByCode(@PathVariable String code) {
        LOGGER.info("GET /countries/{}", code);
        return countryService.getCountryByCode(code);
    }

    @PostMapping("/countries")
    public ResponseEntity<Country> addCountry(@RequestBody Country country) {
        LOGGER.info("POST /countries");
        Country saved = countryService.addCountry(country);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/countries/{code}")
    public Country updateCountry(@PathVariable String code, @RequestBody Country country) {
        LOGGER.info("PUT /countries/{}", code);
        return countryService.updateCountry(code, country);
    }

    @DeleteMapping("/countries/{code}")
    public ResponseEntity<Void> deleteCountry(@PathVariable String code) {
        LOGGER.info("DELETE /countries/{}", code);
        countryService.deleteCountry(code);
        return ResponseEntity.noContent().build();
    }
}
```

---

## Test Error Handling

```bash
# This returns 404 with JSON error body
curl http://localhost:8080/countries/XX

# Expected response:
# {
#   "status": 404,
#   "message": "Country not found with code: XX",
#   "timestamp": "2024-01-15T10:30:00"
# }
```
