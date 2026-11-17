package cl.viajes.controller;

import cl.viajes.service.ReportService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@io.swagger.v3.oas.annotations.tags.Tag(name = "Reportes", description = "Indicadores y reportes de ventas (administrador)")
@RestController
@RequestMapping("/api/v1/reports")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping
    public Map<String, Object> getReport(@RequestParam(defaultValue = "day") String period) {
        return reportService.getReport(period);
    }
}
