package com.securelens.backend.service;

import com.securelens.backend.dto.request.DetectionRequest;
import com.securelens.backend.dto.response.DetectionResponse;
import com.securelens.backend.model.DetectionLog;
import com.securelens.backend.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.regex.Pattern;

/**
 * DetectionService - Core threat detection logic
 *
 * Detects 3 types of threats:
 * 1. Phishing websites
 * 2. Prompt injection attacks
 * 3. Sensitive data exposure
 */
@Service
@RequiredArgsConstructor
public class DetectionService {

    private final LogService logService;
    private final FeatureFlagService featureFlagService;

    // ── Phishing Keywords ──────────────────────────────────
    private static final List<String> PHISHING_KEYWORDS = List.of(
        "verify your account", "confirm your identity",
        "your account will be suspended", "click here to verify",
        "update your payment", "login to confirm",
        "unusual activity detected", "account locked",
        "verify immediately", "suspended account"
    );

    // ── Phishing URL Patterns ──────────────────────────────
    private static final List<String> PHISHING_URL_PATTERNS = List.of(
        "secure-login", "account-verify", "banking-secure",
        "paypal-confirm", "amazon-security", "apple-id-verify",
        "google-security-alert", "microsoft-login-verify"
    );

    // ── Prompt Injection Patterns ──────────────────────────
    private static final List<String> INJECTION_PATTERNS = List.of(
        "ignore previous instructions",
        "ignore all previous",
        "disregard your instructions",
        "forget your previous",
        "you are now a",
        "act as if you are",
        "pretend you are",
        "your new instructions are",
        "override your programming",
        "bypass your restrictions",
        "jailbreak",
        "dan mode",
        "developer mode enabled"
    );

    // ── Sensitive Data Patterns ────────────────────────────
    private static final List<Pattern> SENSITIVE_PATTERNS = List.of(
        Pattern.compile("(?i)api[_-]?key\\s*[:=]\\s*[\\w-]{20,}"),
        Pattern.compile("(?i)secret[_-]?key\\s*[:=]\\s*[\\w-]{20,}"),
        Pattern.compile("(?i)password\\s*[:=]\\s*\\S{6,}"),
        Pattern.compile("(?i)bearer\\s+[\\w-]{20,}"),
        Pattern.compile("[0-9]{4}[\\s-]?[0-9]{4}[\\s-]?[0-9]{4}[\\s-]?[0-9]{4}"),
        Pattern.compile("(?i)aws_access_key_id\\s*[:=]\\s*[A-Z0-9]{20}"),
        Pattern.compile("(?i)private_key\\s*[:=]\\s*[\\w/+=]{20,}")
    );

    // ── Main Detection Method ──────────────────────────────

    /**
     * Analyze content for threats based on type requested
     */
    public DetectionResponse analyze(DetectionRequest request, User user) {

        String threatType = request.getThreatType().toUpperCase();

        return switch (threatType) {
            case "PHISHING"          -> detectPhishing(request, user);
            case "PROMPT_INJECTION"  -> detectPromptInjection(request, user);
            case "SENSITIVE_DATA"    -> detectSensitiveData(request, user);
            default -> DetectionResponse.builder()
                    .threatDetected(false)
                    .message("Unknown threat type: " + threatType)
                    .url(request.getUrl())
                    .build();
        };
    }

    // ── Phishing Detection ─────────────────────────────────
    private DetectionResponse detectPhishing(
            DetectionRequest request, User user) {

        String content = request.getContent().toLowerCase();
        String url = request.getUrl().toLowerCase();

        // Check URL patterns
        boolean suspiciousUrl = PHISHING_URL_PATTERNS.stream()
                .anyMatch(url::contains);

        // Check content keywords
        boolean suspiciousContent = PHISHING_KEYWORDS.stream()
                .anyMatch(content::contains);

        boolean threatDetected = suspiciousUrl || suspiciousContent;

        // Determine risk level
        DetectionLog.RiskLevel riskLevel = DetectionLog.RiskLevel.LOW;
        if (suspiciousUrl && suspiciousContent) {
            riskLevel = DetectionLog.RiskLevel.CRITICAL;
        } else if (suspiciousUrl || suspiciousContent) {
            riskLevel = DetectionLog.RiskLevel.HIGH;
        }

        // Save log if threat detected
        if (threatDetected) {
            String details = suspiciousUrl
                ? "Suspicious URL pattern detected"
                : "Phishing keywords found in content";

            logService.saveLog(
                user,
                DetectionLog.ThreatType.PHISHING,
                request.getUrl(),
                details,
                riskLevel
            );
        }

        return DetectionResponse.builder()
                .threatDetected(threatDetected)
                .threatType("PHISHING")
                .riskLevel(riskLevel.name())
                .url(request.getUrl())
                .message(threatDetected
                    ? "⚠️ Phishing threat detected! Avoid this website."
                    : "✅ No phishing threat detected.")
                .details(threatDetected
                    ? "Suspicious patterns found in URL or content"
                    : "Content appears safe")
                .build();
    }

    // ── Prompt Injection Detection ─────────────────────────
    private DetectionResponse detectPromptInjection(
            DetectionRequest request, User user) {

        String content = request.getContent().toLowerCase();

        boolean threatDetected = INJECTION_PATTERNS.stream()
                .anyMatch(content::contains);

        DetectionLog.RiskLevel riskLevel = threatDetected
                ? DetectionLog.RiskLevel.HIGH
                : DetectionLog.RiskLevel.LOW;

        // Save log if threat detected
        if (threatDetected) {
            String matchedPattern = INJECTION_PATTERNS.stream()
                    .filter(content::contains)
                    .findFirst()
                    .orElse("unknown pattern");

            logService.saveLog(
                user,
                DetectionLog.ThreatType.PROMPT_INJECTION,
                request.getUrl(),
                "Injection pattern found: " + matchedPattern,
                riskLevel
            );
        }

        return DetectionResponse.builder()
                .threatDetected(threatDetected)
                .threatType("PROMPT_INJECTION")
                .riskLevel(riskLevel.name())
                .url(request.getUrl())
                .message(threatDetected
                    ? "⚠️ Prompt injection attack detected!"
                    : "✅ No prompt injection detected.")
                .details(threatDetected
                    ? "Malicious instruction override attempt found"
                    : "Content appears safe")
                .build();
    }

    // ── Sensitive Data Detection ───────────────────────────
    private DetectionResponse detectSensitiveData(
            DetectionRequest request, User user) {

        String content = request.getContent();

        boolean threatDetected = SENSITIVE_PATTERNS.stream()
                .anyMatch(pattern -> pattern.matcher(content).find());

        DetectionLog.RiskLevel riskLevel = threatDetected
                ? DetectionLog.RiskLevel.CRITICAL
                : DetectionLog.RiskLevel.LOW;

        // Save log if threat detected
        if (threatDetected) {
            logService.saveLog(
                user,
                DetectionLog.ThreatType.SENSITIVE_DATA,
                request.getUrl(),
                "Sensitive data pattern found in content",
                riskLevel
            );
        }

        return DetectionResponse.builder()
                .threatDetected(threatDetected)
                .threatType("SENSITIVE_DATA")
                .riskLevel(riskLevel.name())
                .url(request.getUrl())
                .message(threatDetected
                    ? "⚠️ Sensitive data detected! Do not submit this."
                    : "✅ No sensitive data detected.")
                .details(threatDetected
                    ? "API keys, passwords or card numbers found"
                    : "Content appears safe")
                .build();
    }
}