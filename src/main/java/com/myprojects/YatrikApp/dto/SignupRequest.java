package com.myprojects.YatrikApp.dto;

import com.myprojects.YatrikApp.entity.enums.Role;
import lombok.Data;

import java.util.Set;

@Data
public class SignupRequest {
    private String name;
    private String email;
    private String password;

    /**
     * Optional. When omitted the user is registered as a {@link Role#GUEST}.
     * Allows creating {@code HOTEL_MANAGER} accounts from the same endpoint.
     */
    private Set<Role> roles;
}
