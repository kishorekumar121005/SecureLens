package com.securelens.backend.controller;

import com.securelens.backend.dto.response.ApiResponse;
import com.securelens.backend.model.Subscription;
import com.securelens.backend.service.SubscriptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * SubscriptionController - Manages user subscriptions
 *
 * GET  /api/subscription          ← Get current subscription
 * POST /api/subscription/upgrade  ← Upgrade to premium
 * POST /api/subscription/downgrade← Downgrade to free
 * GET  /api/subscription/status   ← Check if premium
 */
@RestController
@RequestMapping("/api/subscription")
@RequiredArgsConstructor
public class SubscriptionController {

    private final SubscriptionService subscriptionService;

    // ── Get Current Subscription ───────────────────────────
    @GetMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> getSubscription() {

        var subscription = subscriptionService.getCurrentSubscription();

        Map<String, Object> data = new HashMap<>();
        data.put("plan", subscription.getPlan().name());
        data.put("status", subscription.getStatus().name());
        data.put("startDate", subscription.getStartDate());
        data.put("endDate", subscription.getEndDate());

        return ResponseEntity.ok(
            ApiResponse.success("Subscription retrieved", data)
        );
    }

    // ── Upgrade to Premium ─────────────────────────────────
    @PostMapping("/upgrade")
    public ResponseEntity<ApiResponse<Map<String, Object>>> upgrade() {

        var subscription = subscriptionService.upgradeToPremium();

        Map<String, Object> data = new HashMap<>();
        data.put("plan", subscription.getPlan().name());
        data.put("status", subscription.getStatus().name());
        data.put("startDate", subscription.getStartDate());
        data.put("endDate", subscription.getEndDate());
        data.put("message", "Successfully upgraded to Premium!");

        return ResponseEntity.ok(
            ApiResponse.success("Upgraded to Premium", data)
        );
    }

    // ── Downgrade to Free ──────────────────────────────────
    @PostMapping("/downgrade")
    public ResponseEntity<ApiResponse<Map<String, Object>>> downgrade() {

        var subscription = subscriptionService.downgradeToFree();

        Map<String, Object> data = new HashMap<>();
        data.put("plan", subscription.getPlan().name());
        data.put("status", subscription.getStatus().name());
        data.put("message", "Downgraded to Free plan");

        return ResponseEntity.ok(
            ApiResponse.success("Downgraded to Free", data)
        );
    }

    // ── Check Premium Status ───────────────────────────────
    @GetMapping("/status")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getStatus() {

        boolean isPremium = subscriptionService.isPremium();

        Map<String, Object> data = new HashMap<>();
        data.put("isPremium", isPremium);
        data.put("plan", isPremium ? "PREMIUM" : "FREE");
        data.put("features", isPremium
            ? new String[]{"AI Detection", "Full Logs",
                           "Real-time Monitoring", "Basic Phishing",
                           "Prompt Injection"}
            : new String[]{"Basic Phishing", "Prompt Injection"}
        );

        return ResponseEntity.ok(
            ApiResponse.success("Status retrieved", data)
        );
    }
}