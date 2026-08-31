package com.myprojects.YatrikApp.security;

import com.myprojects.YatrikApp.entity.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

/**
 * Issues and validates stateless JWTs (HS256). The token subject is the user id;
 * email and roles are carried as claims for convenience.
 */
@Service
public class JwtService {

    private static final long EXPIRY_MILLIS = 1000L * 60 * 60 * 10; // 10 hours

    private final SecretKey secretKey;

    public JwtService(@Value("${jwt.secretKey}") String jwtSecret) {
        this.secretKey = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
    }

    public String generateToken(User user) {
        return Jwts.builder()
                .subject(user.getId().toString())
                .claim("email", user.getEmail())
                .claim("roles", user.getRoles().stream().map(Enum::name).toList())
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + EXPIRY_MILLIS))
                .signWith(secretKey)
                .compact();
    }

    /** Parses and verifies the token, returning the user id from the subject. Throws {@code JwtException} if invalid. */
    public Long getUserIdFromToken(String token) {
        Claims claims = Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
        return Long.valueOf(claims.getSubject());
    }
}
