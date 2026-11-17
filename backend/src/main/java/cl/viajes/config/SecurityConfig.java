package cl.viajes.config;

import cl.viajes.security.JwtAuthenticationFilter;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.security.authorization.AuthorizationDecision;
import org.springframework.security.authorization.AuthorizationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.intercept.RequestAuthorizationContext;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http,
            JwtAuthenticationFilter jwtAuthenticationFilter
    ) throws Exception {
        http
                .cors(Customizer.withDefaults())
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .exceptionHandling(errors -> errors
                        .authenticationEntryPoint((request, response, exception) ->
                                writeError(response, HttpServletResponse.SC_UNAUTHORIZED,
                                        "Se requiere un token válido"))
                        .accessDeniedHandler((request, response, exception) ->
                                writeError(response, HttpServletResponse.SC_FORBIDDEN,
                                        "No tienes permisos para realizar esta operación")))
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers("/error").permitAll()
                        .requestMatchers(HttpMethod.POST,
                                "/api/v1/auth/login", "/api/v1/auth/register", "/api/v1/auth/google",
                                "/api/v1/auth/refresh", "/api/v1/auth/forgot-password", "/api/v1/auth/reset-password",
                                "/api/v1/contact-messages", "/api/v1/purchases").access(permitUnlessSeller())
                        .requestMatchers("/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html")
                                .access(permitUnlessSeller())
                        .requestMatchers(HttpMethod.GET,
                                "/api/v1/products", "/api/v1/products/**",
                                "/api/v1/productos", "/api/v1/productos/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/v1/ordenes", "/api/v1/ordenes/**")
                                .hasAnyRole("SELLER", "ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/v1/purchases/mine").authenticated()
                        .requestMatchers(HttpMethod.GET, "/api/v1/purchases/**").access(permitUnlessSeller())
                        .requestMatchers("/api/v1/auth/me", "/api/v1/auth/change-password").authenticated()
                        .requestMatchers(HttpMethod.POST, "/api/v1/auth/logout").authenticated()
                        .requestMatchers(
                                "/api/v1/users", "/api/v1/users/**",
                                "/api/v1/contact-messages", "/api/v1/contact-messages/**",
                                "/api/v1/reports", "/api/v1/reports/**",
                                "/api/v1/fleet-events", "/api/v1/fleet-events/**",
                                "/api/v1/sales", "/api/v1/sales/**",
                                "/api/v1/products", "/api/v1/products/**",
                                "/api/v1/productos", "/api/v1/productos/**"
                        ).hasRole("ADMIN")
                        .anyRequest().denyAll())
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    private AuthorizationManager<RequestAuthorizationContext> permitUnlessSeller() {
        return (authentication, context) ->
                new AuthorizationDecision(!isSeller(authentication.get()));
    }

    private boolean isSeller(Authentication authentication) {
        return authentication.getAuthorities().stream()
                .anyMatch(authority -> "ROLE_SELLER".equals(authority.getAuthority()));
    }

    private void writeError(HttpServletResponse response, int status, String message) throws java.io.IOException {
        response.setStatus(status);
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.getWriter().write("{\"error\":\"" + message + "\"}");
    }
}
