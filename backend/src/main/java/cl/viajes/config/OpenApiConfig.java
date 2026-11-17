package cl.viajes.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    private static final String BEARER = "bearerAuth";

    @Bean
    public OpenAPI viajesApiOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("API de Viajes por Chile")
                        .description("API REST para la venta de boletos de bus y la administración de rutas, "
                                + "ventas, flota, usuarios y mensajes. Para probar endpoints protegidos, inicia sesión en "
                                + "POST /api/v1/auth/login y pega el token en el botón Authorize.")
                        .version("1.0.0"))
                .components(new Components().addSecuritySchemes(BEARER, new SecurityScheme()
                        .type(SecurityScheme.Type.HTTP)
                        .scheme("bearer")
                        .bearerFormat("JWT")))
                .addSecurityItem(new SecurityRequirement().addList(BEARER));
    }
}
