package com.securelens.backend.service;

import com.securelens.backend.model.FeatureFlag;
import com.securelens.backend.model.User;
import com.securelens.backend.repository.FeatureRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

/**
 * FeatureFlagService
 * Controls which features are available to free vs premium users
 */
@Service
@RequiredArgsConstructor
public class FeatureFlagService {

    private final FeatureRepository featureRepository;

    /**
     * Check if a feature is available for a user
     * Free users cannot access premium-only features
     */
    public boolean isFeatureAvailable(String featureName, User user) {

        // Find the feature flag in DB
        var featureOpt = featureRepository.findByFeatureName(featureName);

        // If feature doesn't exist or is disabled → not available
        if (featureOpt.isEmpty()) return false;

        FeatureFlag feature = featureOpt.get();

        // If feature is globally disabled → not available
        if (!feature.getIsEnabled()) return false;

        // If feature is premium only → check user plan
        if (feature.getPremiumOnly()) {
            return user.getPlan() == User.Plan.PREMIUM;
        }

        // Feature is available for everyone
        return true;
    }

    /**
     * Initialize default feature flags in DB
     * Called once when setting up the system
     */
    public void initializeDefaultFlags() {

        createIfNotExists("BASIC_PHISHING",
            "Basic phishing detection", false);

        createIfNotExists("PROMPT_INJECTION",
            "Prompt injection detection", false);

        createIfNotExists("AI_DETECTION",
            "Advanced AI-powered detection", true);

        createIfNotExists("FULL_LOGS",
            "Full detection history logs", true);

        createIfNotExists("REAL_TIME_MONITORING",
            "Real-time threat monitoring", true);
    }

    private void createIfNotExists(
            String name, String description, boolean premiumOnly) {

        if (!featureRepository.existsByFeatureName(name)) {
            featureRepository.save(FeatureFlag.builder()
                    .featureName(name)
                    .description(description)
                    .isEnabled(true)
                    .premiumOnly(premiumOnly)
                    .build());
        }
    }
}