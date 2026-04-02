package com.securelens.backend.controller;

import com.securelens.backend.dto.request.DetectionRequest;
import com.securelens.backend.dto.response.ApiResponse;
import com.securelens.backend.dto.response.DetectionResponse;
import com.securelens.backend.dto.response.LogResponse;
import com.securelens.backend.service.DetectionService;
import com.securelens.backend.service.LogService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/detect")
@RequiredArgsConstructor
public class DetectionController {

    private final DetectionService detectionService;
    private final LogService logService;

    // ── Analyze Content ────────────────────────────────────
    @PostMapping
    public ResponseEntity<ApiResponse<DetectionResponse>> analyze(
            @Valid @RequestBody DetectionRequest request) {

        var user = logService.getCurrentUser();
        var response = detectionService.analyze(request, user);

        return ResponseEntity.ok(
            ApiResponse.success("Analysis complete", response)
        );
    }

    // ── Get Detection Logs ─────────────────────────────────
    @GetMapping("/logs")
    public ResponseEntity<ApiResponse<List<LogResponse>>> getLogs() {

        var logs = logService.getLogsForCurrentUser()
                .stream()
                .map(log -> LogResponse.builder()
                        .id(log.getId())
                        .threatType(log.getThreatType().name())
                        .riskLevel(log.getRiskLevel().name())
                        .url(log.getUrl())
                        .details(log.getDetails())
                        .userEmail(log.getUser().getEmail())
                        .detectedAt(log.getDetectedAt())
                        .build())
                .toList();

        return ResponseEntity.ok(
            ApiResponse.success("Logs retrieved", logs)
        );
    }

    // ── Get Stats ──────────────────────────────────────────
    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getStats() {

        long totalThreats = logService.getThreatCountForCurrentUser();
        String email = logService.getCurrentUser().getEmail();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalThreatsDetected", totalThreats);
        stats.put("user", email);

        return ResponseEntity.ok(
            ApiResponse.success("Stats retrieved", stats)
        );
    }
}