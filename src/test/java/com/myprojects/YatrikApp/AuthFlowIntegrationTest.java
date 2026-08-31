package com.myprojects.YatrikApp;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * End-to-end verification of the Phase 0 auth + browse stack against the real database,
 * driven through the servlet layer via MockMvc (no embedded Tomcat required).
 *
 * <p>Runs in a single rolled-back transaction so it leaves no rows behind.
 * Responses are wrapped by {@code GlobalResponseHandler} as {@code { timeStamp, data, error }}.
 */
@SpringBootTest
@AutoConfigureMockMvc
@Transactional
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class AuthFlowIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    private final ObjectMapper objectMapper = new ObjectMapper();

    private static final String EMAIL = "asha.guest@example.com";
    private static final String PASSWORD = "pass1234";

    @Test
    @Order(1)
    void signup_login_me_and_roleGuards_work() throws Exception {
        // 1. Signup (GUEST by default) -> 201 with token + user
        String signupBody = """
                { "name": "Asha", "email": "%s", "password": "%s" }
                """.formatted(EMAIL, PASSWORD);

        MvcResult signupResult = mockMvc.perform(post("/auth/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(signupBody))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.token").isNotEmpty())
                .andExpect(jsonPath("$.data.user.email").value(EMAIL))
                .andExpect(jsonPath("$.data.user.roles[0]").value("GUEST"))
                .andReturn();

        // 2. Login -> 200 with a fresh token
        String loginBody = """
                { "email": "%s", "password": "%s" }
                """.formatted(EMAIL, PASSWORD);

        MvcResult loginResult = mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(loginBody))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.token").isNotEmpty())
                .andReturn();

        String token = readJson(loginResult).path("data").path("token").asText();
        assertThat(token).isNotBlank();

        // 3. /auth/me with the token -> 200, echoes the user
        mockMvc.perform(get("/auth/me").header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.email").value(EMAIL))
                .andExpect(jsonPath("$.data.roles[0]").value("GUEST"));

        // 4. Protected endpoint WITHOUT a token -> rejected
        mockMvc.perform(get("/bookings"))
                .andExpect(status().is4xxClientError());

        // 5. GET /bookings WITH a GUEST token -> 200, empty list
        mockMvc.perform(get("/bookings").header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data").isArray());

        // 6. Role guard: a GUEST hitting a HOTEL_MANAGER endpoint -> 403
        mockMvc.perform(get("/admin/hotels").header("Authorization", "Bearer " + token))
                .andExpect(status().isForbidden());
    }

    @Test
    @Order(2)
    void hotelSearch_isPublic_andAcceptsPostBody() throws Exception {
        // The search fix: POST with a JSON body (browsers cannot send a GET body).
        String searchBody = """
                { "city": "Pune", "startDate": "2026-09-10", "endDate": "2026-09-12", "roomsCount": 1 }
                """;

        mockMvc.perform(post("/hotels/search")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(searchBody))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.content").isArray());
    }

    private JsonNode readJson(MvcResult result) throws Exception {
        return objectMapper.readTree(result.getResponse().getContentAsString());
    }
}
