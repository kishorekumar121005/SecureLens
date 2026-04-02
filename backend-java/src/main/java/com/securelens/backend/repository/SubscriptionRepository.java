package com.securelens.backend.repository;

import com.securelens.backend.model.Subscription;
import com.securelens.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * SubscriptionRepository - Database access for Subscription entity
 */
@Repository
public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {

    // Find subscription by user
    Optional<Subscription> findByUser(User user);
}