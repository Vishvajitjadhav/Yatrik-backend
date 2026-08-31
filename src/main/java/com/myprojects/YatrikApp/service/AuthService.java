package com.myprojects.YatrikApp.service;

import com.myprojects.YatrikApp.dto.LoginRequest;
import com.myprojects.YatrikApp.dto.LoginResponse;
import com.myprojects.YatrikApp.dto.SignupRequest;
import com.myprojects.YatrikApp.dto.UserDto;
import com.myprojects.YatrikApp.entity.User;
import com.myprojects.YatrikApp.entity.enums.Role;
import com.myprojects.YatrikApp.repository.UserRepository;
import com.myprojects.YatrikApp.security.JwtService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public LoginResponse signup(SignupRequest request) {
        log.info("Signing up user with email: {}", request.getEmail());

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalStateException("A user is already registered with email: " + request.getEmail());
        }

        Set<Role> roles = (request.getRoles() == null || request.getRoles().isEmpty())
                ? Set.of(Role.GUEST)
                : request.getRoles();

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRoles(roles);

        user = userRepository.save(user);

        String token = jwtService.generateToken(user);
        return new LoginResponse(token, toDto(user));
    }

    public LoginResponse login(LoginRequest request) {
        log.info("Logging in user with email: {}", request.getEmail());

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

        User user = (User) authentication.getPrincipal();
        String token = jwtService.generateToken(user);
        return new LoginResponse(token, toDto(user));
    }

    public UserDto toDto(User user) {
        return new UserDto(user.getId(), user.getName(), user.getEmail(), user.getRoles());
    }
}
