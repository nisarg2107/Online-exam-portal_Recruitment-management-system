package com.roima.learn.application.repository;

import com.roima.learn.application.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Integer> {
    boolean existsByType(String type);
}
