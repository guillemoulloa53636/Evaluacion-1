package cl.viajes.repository;

import cl.viajes.model.Sale;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface SaleRepository extends JpaRepository<Sale, Long> {
    Optional<Sale> findBySaleCode(String saleCode);
    List<Sale> findByCreatedAtGreaterThanEqualOrderByCreatedAtDescIdDesc(LocalDateTime from);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select s from Sale s where s.saleCode = :saleCode")
    Optional<Sale> findBySaleCodeForUpdate(@Param("saleCode") String saleCode);
}
