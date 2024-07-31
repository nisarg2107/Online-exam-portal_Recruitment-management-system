package com.roima.learn.application.repository;

import com.roima.learn.application.model.Exam;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ExamRepository extends JpaRepository<Exam, Integer> {
    boolean existsByName(String name);
}
