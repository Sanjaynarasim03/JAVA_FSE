# Exercise 3 - Spring REST with Database Integration

## Scenario
Connect the Spring REST application to a database using Spring Data JPA.

---

## Dependencies (pom.xml additions)

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>
<dependency>
    <groupId>com.h2database</groupId>
    <artifactId>h2</artifactId>
    <scope>runtime</scope>
</dependency>
```

---

## application.properties

```properties
server.port=8080
spring.application.name=springlearn

# H2 Database
spring.datasource.url=jdbc:h2:mem:testdb
spring.datasource.driverClassName=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=

# JPA
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
spring.jpa.hibernate.ddl-auto=create-drop
spring.jpa.show-sql=true

# H2 Console
spring.h2.console.enabled=true
spring.h2.console.path=/h2-console

# Logging
logging.level.com.cognizant=DEBUG
```

---

## Country.java (JPA Entity)

```java
package com.cognizant.springlearn.model;

import jakarta.persistence.*;

@Entity
@Table(name = "countries")
public class Country {

    @Id
    @Column(length = 3)
    private String code;

    @Column(nullable = false)
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
}
```

---

## CountryRepository.java

```java
package com.cognizant.springlearn.repository;

import com.cognizant.springlearn.model.Country;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CountryRepository extends JpaRepository<Country, String> {

    List<Country> findByNameContainingIgnoreCase(String name);

    List<Country> findByPopulationGreaterThan(long population);
}
```

---

## data.sql (Initial Test Data)
`src/main/resources/data.sql`

```sql
INSERT INTO countries (code, name, capital, population) VALUES
    ('IN', 'India', 'New Delhi', 1400000000),
    ('US', 'United States', 'Washington D.C.', 330000000),
    ('GB', 'United Kingdom', 'London', 67000000),
    ('DE', 'Germany', 'Berlin', 83000000),
    ('JP', 'Japan', 'Tokyo', 126000000);
```

Add to `application.properties`:
```properties
spring.sql.init.mode=always
```

---

## CountryService.java (with JPA)

```java
package com.cognizant.springlearn.service;

import com.cognizant.springlearn.exception.CountryNotFoundException;
import com.cognizant.springlearn.model.Country;
import com.cognizant.springlearn.repository.CountryRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CountryService {

    private static final Logger LOGGER = LoggerFactory.getLogger(CountryService.class);

    @Autowired
    private CountryRepository countryRepository;

    public List<Country> getAllCountries() {
        return countryRepository.findAll();
    }

    public Country getCountryByCode(String code) {
        return countryRepository.findById(code.toUpperCase())
            .orElseThrow(() -> new CountryNotFoundException(code));
    }

    public Country addCountry(Country country) {
        country.setCode(country.getCode().toUpperCase());
        return countryRepository.save(country);
    }

    public Country updateCountry(String code, Country updated) {
        if (!countryRepository.existsById(code.toUpperCase())) {
            throw new CountryNotFoundException(code);
        }
        updated.setCode(code.toUpperCase());
        return countryRepository.save(updated);
    }

    public void deleteCountry(String code) {
        if (!countryRepository.existsById(code.toUpperCase())) {
            throw new CountryNotFoundException(code);
        }
        countryRepository.deleteById(code.toUpperCase());
    }

    public List<Country> searchByName(String name) {
        return countryRepository.findByNameContainingIgnoreCase(name);
    }
}
```

---

## CountryController.java (Complete CRUD + Search)

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
        return countryService.getAllCountries();
    }

    @GetMapping("/countries/{code}")
    public Country getByCode(@PathVariable String code) {
        return countryService.getCountryByCode(code);
    }

    @GetMapping("/countries/search")
    public List<Country> searchByName(@RequestParam String name) {
        return countryService.searchByName(name);
    }

    @PostMapping("/countries")
    public ResponseEntity<Country> addCountry(@RequestBody Country country) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(countryService.addCountry(country));
    }

    @PutMapping("/countries/{code}")
    public Country updateCountry(@PathVariable String code, @RequestBody Country country) {
        return countryService.updateCountry(code, country);
    }

    @DeleteMapping("/countries/{code}")
    public ResponseEntity<Void> deleteCountry(@PathVariable String code) {
        countryService.deleteCountry(code);
        return ResponseEntity.noContent().build();
    }
}
```

---

## Test Endpoints

```bash
# Get all (from DB)
curl http://localhost:8080/countries

# Search by name
curl "http://localhost:8080/countries/search?name=ind"

# Add new country
curl -X POST http://localhost:8080/countries \
  -H "Content-Type: application/json" \
  -d '{"code":"FR","name":"France","capital":"Paris","population":67500000}'
```
