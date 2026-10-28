package cl.viajes.model;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

import java.util.ArrayList;
import java.util.List;

/** Guarda List&lt;Object&gt; como JSON en columnas LONGTEXT (gallery, schedules). */
@Converter
public class JsonListConverter implements AttributeConverter<List<Object>, String> {

    private static final ObjectMapper MAPPER = new ObjectMapper();

    @Override
    public String convertToDatabaseColumn(List<Object> attribute) {
        try {
            return MAPPER.writeValueAsString(attribute == null ? new ArrayList<>() : attribute);
        } catch (JsonProcessingException e) {
            throw new IllegalArgumentException("JSON inválido", e);
        }
    }

    @Override
    public List<Object> convertToEntityAttribute(String dbData) {
        try {
            if (dbData == null || dbData.isBlank()) return new ArrayList<>();
            return MAPPER.readValue(dbData, new TypeReference<List<Object>>() {});
        } catch (JsonProcessingException e) {
            return new ArrayList<>();
        }
    }
}
