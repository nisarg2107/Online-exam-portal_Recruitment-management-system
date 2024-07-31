package com.roima.learn.application.repository;

import com.roima.learn.application.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);

//    @Query("SELECT u FROM User u WHERE u.active = true")
//    Page<User> findAll(Pageable pageable);
}
