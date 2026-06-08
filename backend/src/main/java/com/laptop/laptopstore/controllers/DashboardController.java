package com.laptop.laptopstore.controllers;

import com.laptop.laptopstore.dtos.DashboardDTO;
import com.laptop.laptopstore.dtos.DashboardSummaryDTO;
import com.laptop.laptopstore.dtos.LabelValueDTO;
import com.laptop.laptopstore.dtos.MonthlyRevenueDTO;
import com.laptop.laptopstore.dtos.ProductSalesDTO;
import com.laptop.laptopstore.dtos.RevenuePointDTO;
import com.laptop.laptopstore.services.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/admin/dashboard")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class DashboardController {
    private final DashboardService dashboardService;

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<DashboardSummaryDTO> getDashboardStats(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate
    ) {
        return ResponseEntity.ok(dashboardService.getSummary(fromDate, toDate));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/legacy")
    public ResponseEntity<DashboardDTO> getLegacyDashboardStats(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate
    ) {
        return ResponseEntity.ok(dashboardService.getLegacyStats(fromDate, toDate));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/revenue-series")
    public ResponseEntity<List<RevenuePointDTO>> getRevenueSeries(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate,
            @RequestParam(defaultValue = "DAY") String groupBy
    ) {
        return ResponseEntity.ok(dashboardService.getRevenueSeries(fromDate, toDate, groupBy));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/revenue-monthly")
    public ResponseEntity<List<MonthlyRevenueDTO>> getMonthlyRevenue(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate
    ) {
        return ResponseEntity.ok(dashboardService.getMonthlyRevenue(fromDate, toDate));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/order-status")
    public ResponseEntity<List<LabelValueDTO>> getOrderStatusStats(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate
    ) {
        return ResponseEntity.ok(dashboardService.getOrderStatusStats(fromDate, toDate));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping({"/users-monthly", "/users-daily"})
    public ResponseEntity<List<LabelValueDTO>> getMonthlyUsers(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate,
            @RequestParam(defaultValue = "MONTH") String groupBy
    ) {
        return ResponseEntity.ok(dashboardService.getMonthlyUsers(fromDate, toDate, groupBy));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/category-share")
    public ResponseEntity<List<LabelValueDTO>> getCategoryShare() {
        return ResponseEntity.ok(dashboardService.getCategoryShare());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/top-products")
    public ResponseEntity<List<ProductSalesDTO>> getTopProducts(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate,
            @RequestParam(defaultValue = "10") Integer limit
    ) {
        return ResponseEntity.ok(dashboardService.getTopProductSales(fromDate, toDate, limit));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/report")
    public ResponseEntity<byte[]> exportRevenueReport(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate,
            @RequestParam(defaultValue = "DAY") String groupBy
    ) {
        byte[] data = dashboardService.exportRevenueReport(fromDate, toDate, groupBy);
        String filename = dashboardService.buildReportFilename(fromDate, toDate);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + filename)
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(data);
    }
}
