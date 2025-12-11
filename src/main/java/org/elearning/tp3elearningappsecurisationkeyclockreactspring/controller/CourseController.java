package org.elearning.tp3elearningappsecurisationkeyclockreactspring.controller;

import jakarta.validation.Valid;
import org.elearning.tp3elearningappsecurisationkeyclockreactspring.model.Course;
import org.elearning.tp3elearningappsecurisationkeyclockreactspring.service.CourseService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
    private CourseService courseService;

    public CourseController() {
        courses.add(new Course(nextId++, "Spring Boot Basics", "Learn Spring Boot", "John Doe"));
        courses.add(new Course(nextId++, "React Fundamentals", "Master React", "Jane Smith"));
        courses.add(new Course(nextId++, "Keycloak Security", "Secure your apps", "Bob Johnson"));
    }

    // Endpoint pour obtenir les informations de l'utilisateur connecté
    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> getUserInfo(Authentication authentication) {
        return ResponseEntity.ok(Map.of(
                "username", authentication.getName(),
                "authorities", authentication.getAuthorities()
        ));
    }

    // GET - Récupérer tous les cours (accessible à STUDENT et ADMIN)
    @GetMapping("/courses")
    @PreAuthorize("hasAnyRole('STUDENT', 'ADMIN')")
    public ResponseEntity<List<Course>> getAllCourses() {
        List<Course> courses = courseService.getAllCourses();
        return ResponseEntity.ok(courses);
    }

    // GET - Récupérer un cours par ID
    @GetMapping("/courses/{id}")
    @PreAuthorize("hasAnyRole('STUDENT', 'ADMIN')")
    public ResponseEntity<Course> getCourseById(@PathVariable Long id) {
        return courseService.getCourseById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // POST - Créer un nouveau cours (réservé à ADMIN)
    @PostMapping("/courses")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Course> createCourse(@Valid @RequestBody Course course) {
        Course createdCourse = courseService.createCourse(course);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdCourse);
    }

    // PUT - Mettre à jour un cours (réservé à ADMIN)
    @PutMapping("/courses/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Course> updateCourse(
            @PathVariable Long id,
            @Valid @RequestBody Course courseDetails) {
        try {
            Course updatedCourse = courseService.updateCourse(id, courseDetails);
            return ResponseEntity.ok(updatedCourse);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // DELETE - Supprimer un cours (réservé à ADMIN)
    @DeleteMapping("/courses/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteCourse(@PathVariable Long id) {
        try {
            courseService.deleteCourse(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // GET - Rechercher des cours par titre
    @GetMapping("/courses/search")
    @PreAuthorize("hasAnyRole('STUDENT', 'ADMIN')")
    public ResponseEntity<List<Course>> searchCourses(@RequestParam String title) {
        List<Course> courses = courseService.searchCoursesByTitle(title);
        return ResponseEntity.ok(courses);
    }

    // GET - Trouver les cours d'un instructeur
    @GetMapping("/courses/instructor/{instructor}")
    @PreAuthorize("hasAnyRole('STUDENT', 'ADMIN')")
    public ResponseEntity<List<Course>> getCoursesByInstructor(@PathVariable String instructor) {
        List<Course> courses = courseService.getCoursesByInstructor(instructor);
        return ResponseEntity.ok(courses);
    }
}