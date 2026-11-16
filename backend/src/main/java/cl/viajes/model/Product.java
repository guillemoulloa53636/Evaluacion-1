package cl.viajes.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "products")
public class Product {

    @Id
    @Column(length = 32)
    private String id;

    @NotBlank
    @Size(max = 100)
    @Column(nullable = false, unique = true, length = 100)
    private String slug;

    @NotBlank
    @Size(max = 180)
    private String title;

    @NotBlank
    @Size(max = 120)
    private String destination;

    @Positive
    private int price;

    @NotBlank
    @Size(max = 60)
    private String type;

    @NotBlank
    @Pattern(regexp = "Activo|Agotado", message = "El estado debe ser Activo o Agotado")
    @Column(nullable = false)
    private String status = "Activo";

    @NotBlank
    @Size(max = 255)
    private String image;

    @NotNull
    @Column(columnDefinition = "TEXT")
    private String description = "";

    @NotNull
    @Convert(converter = JsonListConverter.class)
    @Column(columnDefinition = "LONGTEXT")
    private List<Object> gallery = new ArrayList<>();

    @JsonProperty("discount_percent")
    @Min(0)
    @Max(90)
    @Column(name = "discount_percent")
    private int discountPercent = 0;

    @NotNull
    @Convert(converter = JsonListConverter.class)
    @Column(columnDefinition = "LONGTEXT")
    private List<Object> schedules = new ArrayList<>();

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDestination() { return destination; }
    public void setDestination(String destination) { this.destination = destination; }
    public int getPrice() { return price; }
    public void setPrice(int price) { this.price = price; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public List<Object> getGallery() { return gallery; }
    public void setGallery(List<Object> gallery) { this.gallery = gallery; }
    public int getDiscountPercent() { return discountPercent; }
    public void setDiscountPercent(int discountPercent) { this.discountPercent = discountPercent; }
    public List<Object> getSchedules() { return schedules; }
    public void setSchedules(List<Object> schedules) { this.schedules = schedules; }
}
