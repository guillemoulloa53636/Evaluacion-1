package cl.viajes.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI viajesApiOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("API de Viajes por Chile")
                        .description("API para consultar y administrar las rutas de Viajes por Chile.")
                        .version("1.0.0"));
    }
}
