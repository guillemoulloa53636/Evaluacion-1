package cl.viajes.security;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class AuthRateLimitFilterTest {

    @Test
    void bloqueaDespuesDelMaximoDeIntentos() {
        AuthRateLimitFilter filter = new AuthRateLimitFilter(3, 60);
        assertTrue(filter.tryAcquire("ip", 0));
        assertTrue(filter.tryAcquire("ip", 1));
        assertTrue(filter.tryAcquire("ip", 2));
        assertFalse(filter.tryAcquire("ip", 3));
    }

    @Test
    void liberaCuandoPasaLaVentana() {
        AuthRateLimitFilter filter = new AuthRateLimitFilter(1, 60);
        assertTrue(filter.tryAcquire("ip", 0));
        assertFalse(filter.tryAcquire("ip", 1_000));
        assertTrue(filter.tryAcquire("ip", 61_000));
    }

    @Test
    void cadaClaveTieneSuPropioContador() {
        AuthRateLimitFilter filter = new AuthRateLimitFilter(1, 60);
        assertTrue(filter.tryAcquire("a", 0));
        assertTrue(filter.tryAcquire("b", 0));
    }
}
