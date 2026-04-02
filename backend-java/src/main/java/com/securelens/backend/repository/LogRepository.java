package com.securelens.backend.repository;

import com.securelens.backend.model.DetectionLog;
import com.securelens.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * LogRepository - Database access for DetectionLog entity
 */
@Repository
public interface LogRepository extends JpaRepository<DetectionLog, Long> {

    // Get all logs for a specific user
    List<DetectionLog> findByUserOrderByDetectedAtDesc(User user);

    // Count total threats detected for a user
    long countByUser(User user);

    // Get logs by threat type for a user
    List<DetectionLog> findByUserAndThreatType(
        User user,
        DetectionLog.ThreatType threatType
    );
}