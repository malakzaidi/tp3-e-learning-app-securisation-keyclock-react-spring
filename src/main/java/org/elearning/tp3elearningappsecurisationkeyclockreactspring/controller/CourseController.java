package org.elearning.tp3elearningappsecurisationkeyclockreactspring.controller;

import org.elearning.tp3elearningappsecurisationkeyclockreactspring.model.Course;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class CourseController {

    private List<Course> courses = new ArrayList<>();
    private Long nextId = 1L;

    public CourseController() {
        courses.add(new Course(nextId++, "Spring Boot Basics", "Learn Spring Boot", "John Doe"));
        courses.add(new Course(nextId++, "React Fundamentals", "Master React", "Jane Smith"));
        courses.add(new Course(nextId++, "Keycloak Security", "Secure your apps", "Bob Johnson"));
    }

    @GetMapping("/courses")
    @PreAuthorize("hasAnyRole('STUDENT', 'ADMIN')")
    public List<Course> getCourses() {
        return courses;
    }

    @PostMapping("/courses")
    @PreAuthorize("hasRole('ADMIN')")
    public Course createCourse(@RequestBody Course course) {
        course.setId(nextId++);
        courses.add(course);
        return course;
    }

    @GetMapping("/me")
    public Map<String, Object> getCurrentUser(Authentication authentication) {
        Jwt jwt = (Jwt) authentication.getPrincipal();
        return jwt.getClaims();
    }
}