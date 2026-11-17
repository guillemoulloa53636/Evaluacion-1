package cl.viajes.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayDeque;
import java.util.Deque;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

/** Limita los intentos por IP en los endpoints sensibles de autenticación (fuerza bruta). */
@Component
public class AuthRateLimitFilter extends OncePerRequestFilter {

    private static final Set<String> LIMITED_PATHS = Set.of(
            "/api/v1/auth/login", "/api/v1/auth/google",
            "/api/v1/auth/forgot-password", "/api/v1/auth/reset-password");

    private final int maxAttempts;
    private final long windowMillis;
    private final Map<String, Deque<Long>> attempts = new ConcurrentHashMap<>();

    public AuthRateLimitFilter(
            @Value("${app.auth.rate-limit.max-attempts:10}") int maxAttempts,
            @Value("${app.auth.rate-limit.window-seconds:300}") long windowSeconds
    ) {
        this.maxAttempts = maxAttempts;
        this.windowMillis = windowSeconds * 1000;
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        return !"POST".equalsIgnoreCase(request.getMethod()) || !LIMITED_PATHS.contains(request.getRequestURI());
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request, HttpServletResponse response, FilterChain chain
    ) throws ServletException, IOException {
        String key = request.getRemoteAddr() + "|" + request.getRequestURI();
        if (!tryAcquire(key, System.currentTimeMillis())) {
            response.setStatus(429);
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            response.setCharacterEncoding("UTF-8");
            response.getWriter().write("{\"error\":\"Demasiados intentos. Espera unos minutos e inténtalo de nuevo\"}");
            return;
        }
        chain.doFilter(request, response);
    }

    boolean tryAcquire(String key, long now) {
        Deque<Long> window = attempts.computeIfAbsent(key, ignored -> new ArrayDeque<>());
        synchronized (window) {
            while (!window.isEmpty() && now - window.peekFirst() > windowMillis) {
                window.pollFirst();
            }
            if (window.size() >= maxAttempts) {
                return false;
            }
            window.addLast(now);
            return true;
        }
    }
}
