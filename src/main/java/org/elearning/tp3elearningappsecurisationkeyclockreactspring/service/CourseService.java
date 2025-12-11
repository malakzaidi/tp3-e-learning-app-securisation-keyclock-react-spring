package org.elearning.tp3elearningappsecurisationkeyclockreactspring.service;

import lombok.RequiredArgsConstructor;
import org.elearning.tp3elearningappsecurisationkeyclockreactspring.model.Course;
import org.elearning.tp3elearningappsecurisationkeyclockreactspring.repository.CourseRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CourseService {

    private final CourseRepository courseRepository;

    // Récupérer tous les cours
    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    // Récupérer un cours par ID
    public Optional<Course> getCourseById(Long id) {
        return courseRepository.findById(id);
    }

    // Créer un nouveau cours
    @Transactional
    public Course createCourse(Course course) {
        return courseRepository.save(course);
    }

    // Mettre à jour un cours existant
    @Transactional
    public Course updateCourse(Long id, Course courseDetails) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cours non trouvé avec l'id: " + id));

        course.setTitle(courseDetails.getTitle());
        course.setDescription(courseDetails.getDescription());
        course.setInstructor(courseDetails.getInstructor());


        return courseRepository.save(course);
    }

    // Supprimer un cours
    @Transactional
    public void deleteCourse(Long id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cours non trouvé avec l'id: " + id));
        courseRepository.delete(course);
    }

    // Rechercher des cours par titre
    public List<Course> searchCoursesByTitle(String title) {
        return courseRepository.findByTitleContainingIgnoreCase(title);
    }

    // Trouver les cours d'un instructeur
    public List<Course> getCoursesByInstructor(String instructor) {
        return courseRepository.findByInstructor(instructor);
    }
}