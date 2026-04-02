package com.securelens.backend.service;

import com.securelens.backend.model.Subscription;
import com.securelens.backend.model.User;
import com.securelens.backend.repository.SubscriptionRepository;
import com.securelens.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

/**
 * SubscriptionService - Handles free vs premium subscription logic
 */
@Service
@RequiredArgsConstructor
public class SubscriptionService {

    private final SubscriptionRepository subscriptionRepository;
    private final UserRepository userRepository;
    private final LogService logService;

    // ── Get Current User Subscription ─────────────────────
    // 🆕 Changed from readOnly = true to full @Transactional
    // Because it may need to CREATE a free subscription if none exists
    @Transactional
    public Subscription getCurrentSubscription() {
        var user = logService.getCurrentUser();
        return subscriptionRepository.findByUser(user)
                .orElseGet(() -> createFreeSubscription(user));
    }

    // ── Upgrade to Premium ─────────────────────────────────
    @Transactional
    public Subscription upgradeToPremium() {
        var user = logService.getCurrentUser();

        // Update user plan
        user.setPlan(User.Plan.PREMIUM);
        userRepository.save(user);

        // Update or create subscription
        var subscription = subscriptionRepository.findByUser(user)
                .orElse(Subscription.builder().user(user).build());

        subscription.setPlan(Subscription.Plan.PREMIUM);
        subscription.setStatus(Subscription.Status.ACTIVE);
        subscription.setStartDate(LocalDateTime.now());
        subscription.setEndDate(LocalDateTime.now().plusMonths(1));

        return subscriptionRepository.save(subscription);
    }

    // ── Downgrade to Free ──────────────────────────────────
    @Transactional
    public Subscription downgradeToFree() {
        var user = logService.getCurrentUser();

        // Update user plan
        user.setPlan(User.Plan.FREE);
        userRepository.save(user);

        // Update subscription
        var subscription = subscriptionRepository.findByUser(user)
                .orElse(Subscription.builder().user(user).build());

        subscription.setPlan(Subscription.Plan.FREE);
        subscription.setStatus(Subscription.Status.CANCELLED);
        subscription.setEndDate(LocalDateTime.now());

        return subscriptionRepository.save(subscription);
    }

    // ── Check if User is Premium ───────────────────────────
    @Transactional(readOnly = true)
    public boolean isPremium() {
        var user = logService.getCurrentUser();
        return user.getPlan() == User.Plan.PREMIUM;
    }

    // ── Create Free Subscription ───────────────────────────
    // 🆕 This runs inside the parent @Transactional from getCurrentSubscription()
    private Subscription createFreeSubscription(User user) {
        var subscription = Subscription.builder()
                .user(user)
                .plan(Subscription.Plan.FREE)
                .status(Subscription.Status.ACTIVE)
                .startDate(LocalDateTime.now())
                .build();
        return subscriptionRepository.save(subscription);
    }
}