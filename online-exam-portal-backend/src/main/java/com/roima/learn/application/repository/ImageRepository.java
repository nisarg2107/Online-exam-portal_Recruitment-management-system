package com.roima.learn.application.repository;

import com.roima.learn.application.model.Image;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ImageRepository extends JpaRepository<Image, Integer> {
}
