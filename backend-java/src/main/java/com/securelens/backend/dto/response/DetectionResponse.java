package com.securelens.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DetectionResponse - Returned to Chrome Extension after analysis
 *
 * Example:
 * {
 *   "threatDetected": true,
 *   "threatType": "PHISHING",
 *   "riskLevel": "HIGH",
 *   "message": "Phishing website detected!",
 *   "details": "Suspicious URL pattern found"
 * }
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DetectionResponse {

    private boolean threatDetected;         // true = threat found
    private String threatType;             // Type of threat
    private String riskLevel;             // LOW, MEDIUM, HIGH, CRITICAL
    private String message;               // Human readable message
    private String details;               // Technical details of detection
    private String url;                   // URL that was analyzed
}