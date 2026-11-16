package cl.viajes.repository;

import cl.viajes.dto.OrderSummaryResponse;
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

    @Query("""
            select new cl.viajes.dto.OrderSummaryResponse(
                s.saleCode, s.totalAmount, s.status, s.createdAt, count(t.id)
            )
            from Sale s left join s.tickets t
            group by s.id, s.saleCode, s.totalAmount, s.status, s.createdAt
            order by s.createdAt desc, s.id desc
            """)
    List<OrderSummaryResponse> findAllOrderSummaries();

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select s from Sale s where s.saleCode = :saleCode")
    Optional<Sale> findBySaleCodeForUpdate(@Param("saleCode") String saleCode);
}
