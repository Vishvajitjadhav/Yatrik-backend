package com.myprojects.YatrikApp.controller;

import com.myprojects.YatrikApp.dto.LoginRequest;
import com.myprojects.YatrikApp.dto.LoginResponse;
import com.myprojects.YatrikApp.dto.SignupRequest;
import com.myprojects.YatrikApp.dto.UserDto;
import com.myprojects.YatrikApp.entity.User;
import com.myprojects.YatrikApp.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/signup")
    @Operation(summary = "Register a new user (GUEST by default)", tags = {"Auth"})
    public ResponseEntity<LoginResponse> signup(@RequestBody SignupRequest request) {
        return new ResponseEntity<>(authService.signup(request), HttpStatus.CREATED);
    }

    @PostMapping("/login")
    @Operation(summary = "Authenticate and receive a JWT", tags = {"Auth"})
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @GetMapping("/me")
    @Operation(summary = "Get the currently authenticated user", tags = {"Auth"})
    public ResponseEntity<UserDto> me(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(authService.toDto(user));
    }
}
