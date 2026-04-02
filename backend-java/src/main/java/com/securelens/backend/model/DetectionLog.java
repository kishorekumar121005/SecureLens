package com.securelens.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DetectionLog Entity - Maps to 'detection_logs' table
 * Stores every threat detection event
 */
@Entity
@Table(name = "detection_logs")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DetectionLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ThreatType threatType;          // PHISHING, PROMPT_INJECTION, SENSITIVE_DATA

    @Column(nullable = false)
    private String url;                     // Website URL where threat was detected

    @Column(nullable = false)
    private String details;                 // What exactly was detected

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private RiskLevel riskLevel = RiskLevel.MEDIUM;

    @Column(nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime detectedAt = LocalDateTime.now();

    // ── Enums ─────────────────────────────────────────────
    public enum ThreatType {
        PHISHING,
        PROMPT_INJECTION,
        SENSITIVE_DATA
    }

    public enum RiskLevel {
        LOW, MEDIUM, HIGH, CRITICAL
    }
}