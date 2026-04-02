package com.securelens.backend.repository;

import com.securelens.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * UserRepository - Database access for User entity
 * Spring Data JPA auto-implements all basic CRUD operations
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Find user by email (used for login)
    Optional<User> findByEmail(String email);

    // Check if email already exists (used for registration)
    boolean existsByEmail(String email);
}