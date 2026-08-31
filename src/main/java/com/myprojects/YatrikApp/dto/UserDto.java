package com.myprojects.YatrikApp.dto;

import com.myprojects.YatrikApp.entity.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

/**
 * Public view of a user — never exposes the password hash.
 * Returned by {@code /auth/me} and nested inside {@link LoginResponse}.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDto {
    private Long id;
    private String name;
    private String email;
    private Set<Role> roles;
}
