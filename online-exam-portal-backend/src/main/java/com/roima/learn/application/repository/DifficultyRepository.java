package com.roima.learn.application.repository;

import com.roima.learn.application.model.Difficulty;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DifficultyRepository extends JpaRepository<Difficulty, Integer> {
    boolean existsByLevel(String level);
}


