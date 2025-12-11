package org.elearning.tp3elearningappsecurisationkeyclockreactspring.repository;

import org.elearning.tp3elearningappsecurisationkeyclockreactspring.model.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {

    // Méthodes de recherche personnalisées
    List<Course> findByTitleContainingIgnoreCase(String title);

    List<Course> findByInstructor(String instructor);

    List<Course> findByDurationHoursLessThanEqual(Integer hours);
}