package com.securelens.backend.repository;

import com.securelens.backend.model.FeatureFlag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * FeatureRepository - Database access for FeatureFlag entity
 */
@Repository
public interface FeatureRepository extends JpaRepository<FeatureFlag, Long> {

    // Find feature by name
    Optional<FeatureFlag> findByFeatureName(String featureName);

    // Check if feature exists
    boolean existsByFeatureName(String featureName);
}