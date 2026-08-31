package com.myprojects.YatrikApp.service;

import com.myprojects.YatrikApp.entity.Booking;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

/**
 * Creates Stripe Checkout sessions for a booking.
 * <p>
 * Guarded by config: when {@code stripe.secretKey} is absent (typical for local dev without
 * Stripe keys) it performs a safe no-op — it stamps a placeholder session id on the booking and
 * returns the success URL so the booking flow can still be exercised end-to-end.
 */
@Service
@Slf4j
public class CheckoutService {

    private final String stripeSecretKey;

    public CheckoutService(@Value("${stripe.secretKey:}") String stripeSecretKey) {
        this.stripeSecretKey = stripeSecretKey;
    }

    /**
     * @return the Stripe-hosted checkout URL, or (in dev no-op mode) the success URL.
     */
    public String getCheckoutSession(Booking booking, String successUrl, String failureUrl) {
        if (stripeSecretKey == null || stripeSecretKey.isBlank()) {
            log.warn("Stripe secret key not configured — using dev no-op checkout for booking {}.", booking.getId());
            booking.setPaymentSessionId("dev-session-" + booking.getId());
            return successUrl;
        }

        Stripe.apiKey = stripeSecretKey;

        long amountInMinorUnits = booking.getAmount()
                .multiply(BigDecimal.valueOf(100))
                .longValueExact();

        SessionCreateParams params = SessionCreateParams.builder()
                .setMode(SessionCreateParams.Mode.PAYMENT)
                .setSuccessUrl(successUrl)
                .setCancelUrl(failureUrl)
                .setCustomerEmail(booking.getUser().getEmail())
                .addLineItem(SessionCreateParams.LineItem.builder()
                        .setQuantity(1L)
                        .setPriceData(SessionCreateParams.LineItem.PriceData.builder()
                                .setCurrency("inr")
                                .setUnitAmount(amountInMinorUnits)
                                .setProductData(SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                        .setName(booking.getHotel().getName())
                                        .build())
                                .build())
                        .build())
                .build();

        try {
            Session session = Session.create(params);
            booking.setPaymentSessionId(session.getId());
            return session.getUrl();
        } catch (StripeException e) {
            log.error("Stripe checkout session creation failed for booking {}", booking.getId(), e);
            throw new RuntimeException("Failed to create Stripe checkout session", e);
        }
    }
}
