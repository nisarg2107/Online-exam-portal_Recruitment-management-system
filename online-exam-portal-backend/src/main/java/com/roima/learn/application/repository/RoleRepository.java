package com.roima.learn.application.repository;

import com.roima.learn.application.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RoleRepository extends JpaRepository<Role, Integer> {
    List<Role> findByTypeContainingIgnoreCase(String type);
    boolean existsByType(String type);
}
