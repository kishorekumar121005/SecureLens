package com.securelens.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * FeatureFlag Entity - Maps to 'feature_flags' table
 * Controls which features are available to free vs premium users
 */
@Entity
@Table(name = "feature_flags")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FeatureFlag {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String featureName;             // e.g. "AI_DETECTION", "FULL_LOGS"

    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    @Builder.Default
    private Boolean isEnabled = true;       // Master on/off switch

    @Column(nullable = false)
    @Builder.Default
    private Boolean premiumOnly = false;    // true = premium users only
}