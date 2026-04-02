package com.securelens.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * LogResponse - Safe DTO for returning detection logs
 * Avoids exposing full User entity (fixes lazy loading issue)
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LogResponse {

    private Long id;
    private String threatType;
    private String riskLevel;
    private String url;
    private String details;
    private String userEmail;
    private LocalDateTime detectedAt;
}