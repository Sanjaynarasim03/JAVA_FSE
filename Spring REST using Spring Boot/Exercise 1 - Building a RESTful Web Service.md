# Exercise 1 - Building a RESTful Web Service

## Scenario
Build a basic RESTful API using Spring Boot with a Country resource.

---

## Project Setup
- **Group**: `com.cognizant`
- **Artifact**: `springlearn`
- **Dependencies**: Spring Web

---

## Country.java (Model)
`src/main/java/com/cognizant/springlearn/model/Country.java`

```java
package com.cognizant.springlearn.model;

public class Country {

    private String code;
    private String name;
    private String capital;
    private long population;

    // Constructors
    public Country() {}

    public Country(String code, String name, String capital, long population) {
        this.code = code;
        this.name = name;
        this.capital = capital;
        this.population = population;
    }

    // Getters and Setters
    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCapital() { return capital; }
    public void setCapital(String capital) { this.capital = capital; }

    public long getPopulation() { return population; }
    public void setPopulation(long population) { this.population = population; }

    @Override
    public String toString() {
        return "Country{code='" + code + "', name='" + name +
               "', capital='" + capital + "', population=" + population + "}";
    }
}
```

---

## CountryController.java
`src/main/java/com/cognizant/springlearn/controller/CountryController.java`

```java
package com.cognizant.springlearn.controller;

import com.cognizant.springlearn.model.Country;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@RestController
public class CountryController {

    private static final Logger LOGGER = LoggerFactory.getLogger(CountryController.class);

    // Mock data — in real apps this would come from a database
    private static final List<Country> COUNTRIES = Arrays.asList(
        new Country("IN", "India", "New Delhi", 1_400_000_000L),
        new Country("US", "United States", "Washington D.C.", 330_000_000L),
        new Country("GB", "United Kingdom", "London", 67_000_000L),
        new Country("DE", "Germany", "Berlin", 83_000_000L),
        new Country("JP", "Japan", "Tokyo", 126_000_000L)
    );

    /**
     * GET /countries
     * Returns all countries
     */
    @GetMapping("/countries")
    public List<Country> getAllCountries() {
        LOGGER.info("Start: getAllCountries()");
        LOGGER.debug("Returning {} countries", COUNTRIES.size());
        return COUNTRIES;
    }

    /**
     * GET /countries/{code}
     * Returns a specific country by its code
     */
    @GetMapping("/countries/{code}")
    public Country getCountryByCode(@PathVariable String code) {
        LOGGER.info("Start: getCountryByCode({})", code);
        return COUNTRIES.stream()
            .filter(c -> c.getCode().equalsIgnoreCase(code))
            .findFirst()
            .orElseThrow(() -> new RuntimeException("Country not found: " + code));
    }
}
```

---

## SpringlearnApplication.java

```java
package com.cognizant.springlearn;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class SpringlearnApplication {

    public static void main(String[] args) {
        SpringApplication.run(SpringlearnApplication.class, args);
    }
}
```

---

## application.properties

```properties
server.port=8080
spring.application.name=springlearn
logging.level.com.cognizant=DEBUG
```

---

## Test with cURL

```bash
# Start app
mvn spring-boot:run

# Get all countries
curl http://localhost:8080/countries

# Get specific country
curl http://localhost:8080/countries/IN

# Expected response for /countries/IN:
# {"code":"IN","name":"India","capital":"New Delhi","population":1400000000}
```

---

## REST Concepts Used

| HTTP Method | Endpoint | Description |
|-------------|----------|-------------|
| GET | `/countries` | Retrieve all countries |
| GET | `/countries/{code}` | Retrieve country by code |
