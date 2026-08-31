package com.myprojects.YatrikApp.controller;

import com.myprojects.YatrikApp.service.BookingService;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.model.Event;
import com.stripe.net.Webhook;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Receives Stripe payment webhooks. Public endpoint (no JWT) — authenticity is verified via the
 * Stripe signature. Guarded by config: when {@code stripe.webhookSecret} is absent the webhook is
 * acknowledged and ignored (safe no-op for local dev).
 */
@RestController
@RequestMapping("/webhook")
@RequiredArgsConstructor
@Slf4j
public class WebhookController {

    private final BookingService bookingService;

    @Value("${stripe.webhookSecret:}")
    private String webhookSecret;

    @PostMapping("/payment")
    public ResponseEntity<Void> capturePayments(@RequestBody String payload,
                                                @RequestHeader(value = "Stripe-Signature", required = false) String signatureHeader) {
        if (webhookSecret == null || webhookSecret.isBlank()) {
            log.warn("Stripe webhook secret not configured — ignoring incoming webhook.");
            return ResponseEntity.ok().build();
        }

        try {
            Event event = Webhook.constructEvent(payload, signatureHeader, webhookSecret);
            bookingService.capturePayment(event);
            return ResponseEntity.noContent().build();
        } catch (SignatureVerificationException e) {
            log.warn("Invalid Stripe webhook signature: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
}
