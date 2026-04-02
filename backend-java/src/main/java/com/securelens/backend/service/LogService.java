package com.securelens.backend.service;

import com.securelens.backend.model.DetectionLog;
import com.securelens.backend.model.User;
import com.securelens.backend.repository.LogRepository;
import com.securelens.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LogService {

    private final LogRepository logRepository;
    private final UserRepository userRepository;

    @Transactional
    public DetectionLog saveLog(
            User user,
            DetectionLog.ThreatType threatType,
            String url,
            String details,
            DetectionLog.RiskLevel riskLevel) {

        var log = DetectionLog.builder()
                .user(user)
                .threatType(threatType)
                .url(url)
                .details(details)
                .riskLevel(riskLevel)
                .build();

        return logRepository.save(log);
    }

    @Transactional(readOnly = true)
    public List<DetectionLog> getLogsForCurrentUser() {
        var user = getCurrentUser();
        return logRepository.findByUserOrderByDetectedAtDesc(user);
    }

    @Transactional(readOnly = true)
    public long getThreatCountForCurrentUser() {
        var user = getCurrentUser();
        return logRepository.countByUser(user);
    }

    public User getCurrentUser() {
        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                    new RuntimeException("Authenticated user not found"));
    }
}