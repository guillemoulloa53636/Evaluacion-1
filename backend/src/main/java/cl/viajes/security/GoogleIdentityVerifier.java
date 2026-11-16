package cl.viajes.security;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;
import org.springframework.web.server.ResponseStatusException;

@Component
public class GoogleIdentityVerifier {

    private final RestClient restClient = RestClient.create();
    private final String clientId;

    public GoogleIdentityVerifier(@Value("${app.google.client-id}") String clientId) {
        this.clientId = clientId;
    }

    public GoogleIdentity verify(String credential) {
        if (credential == null || credential.isBlank()) {
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "Falta la credencial de Google");
        }

        GoogleTokenInfo tokenInfo;
        try {
            tokenInfo = restClient.get()
                    .uri("https://oauth2.googleapis.com/tokeninfo?id_token={credential}", credential)
                    .retrieve()
                    .body(GoogleTokenInfo.class);
        } catch (RestClientResponseException exception) {
            throw invalidCredential();
        } catch (ResourceAccessException exception) {
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, "No se pudo validar Google en este momento");
        }

        if (tokenInfo == null || !clientId.equals(tokenInfo.audience())
                || !"true".equalsIgnoreCase(tokenInfo.emailVerified())
                || tokenInfo.email() == null || tokenInfo.email().isBlank()) {
            throw invalidCredential();
        }
        String name = tokenInfo.name() == null || tokenInfo.name().isBlank()
                ? tokenInfo.email()
                : tokenInfo.name().trim();
        return new GoogleIdentity(tokenInfo.email(), name);
    }

    private ResponseStatusException invalidCredential() {
        return new ResponseStatusException(HttpStatus.UNAUTHORIZED, "No se pudo validar la cuenta de Google");
    }

    public record GoogleIdentity(String email, String name) {
    }

    private record GoogleTokenInfo(
            @JsonProperty("aud") String audience,
            String email,
            @JsonProperty("email_verified") String emailVerified,
            String name
    ) {
    }
}
