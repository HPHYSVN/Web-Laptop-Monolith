package com.laptop.laptopstore.services;

import com.laptop.laptopstore.dtos.DashboardDTO;
import com.laptop.laptopstore.dtos.DashboardSummaryDTO;
import com.laptop.laptopstore.dtos.LabelValueDTO;
import com.laptop.laptopstore.dtos.MonthlyRevenueDTO;
import com.laptop.laptopstore.dtos.RevenuePointDTO;
import com.laptop.laptopstore.dtos.RevenueReportRowDTO;
import com.laptop.laptopstore.models.Order;
import com.laptop.laptopstore.repositories.CategoryRepository;
import com.laptop.laptopstore.repositories.OrderRepository;
import com.laptop.laptopstore.repositories.ProductRepository;
import com.laptop.laptopstore.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.BorderStyle;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.ConditionalFormattingRule;
import org.apache.poi.ss.usermodel.Footer;
import org.apache.poi.ss.usermodel.FillPatternType;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.FontFormatting;
import org.apache.poi.ss.usermodel.Header;
import org.apache.poi.ss.usermodel.HorizontalAlignment;
import org.apache.poi.ss.usermodel.IndexedColors;
import org.apache.poi.ss.usermodel.PatternFormatting;
import org.apache.poi.ss.usermodel.PrintSetup;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.SheetConditionalFormatting;
import org.apache.poi.ss.usermodel.VerticalAlignment;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {
    private static final String DELIVERED = "DELIVERED";
    private static final DateTimeFormatter DAY_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    private static final DateTimeFormatter MONTH_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM");
    private static final DateTimeFormatter REPORT_DATE_FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy");
    private static final DateTimeFormatter REPORT_DATE_TIME_FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    @Transactional(readOnly = true)
    public DashboardSummaryDTO getSummary(LocalDate fromDate, LocalDate toDate) {
        DateRange range = resolveRange(fromDate, toDate);
        List<Order> ordersInRange = orderRepository.findByOrderDateBetween(range.fromDateTime(), range.toDateTime());
        List<LabelValueDTO> statusStats = ordersInRange.stream()
                .filter(order -> order.getStatus() != null)
                .collect(Collectors.groupingBy(Order::getStatus, TreeMap::new, Collectors.counting()))
                .entrySet().stream()
                .map(entry -> new LabelValueDTO(entry.getKey(), entry.getValue()))
                .collect(Collectors.toList());

        List<Order> deliveredOrders = ordersInRange.stream()
                .filter(order -> DELIVERED.equals(order.getStatus()))
                .toList();
        double revenue = sumRevenue(deliveredOrders);
        long deliveredCount = deliveredOrders.size();

        return DashboardSummaryDTO.builder()
                .totalUsers(userRepository.count())
                .totalOrders(orderRepository.count())
                .totalProducts(productRepository.count())
                .totalRevenue(revenue)
                .deliveredOrders(deliveredCount)
                .newUsers(userRepository.countByCreateDateBetween(range.fromDateTime(), range.toDateTime()))
                .averageOrderValue(deliveredCount > 0 ? revenue / deliveredCount : 0)
                .ordersByStatus(statusStats)
                .build();
    }

    @Transactional(readOnly = true)
    public DashboardDTO getLegacyStats(LocalDate fromDate, LocalDate toDate) {
        DashboardSummaryDTO summary = getSummary(fromDate, toDate);
        return DashboardDTO.builder()
                .totalUsers(summary.getTotalUsers())
                .totalOrders(summary.getTotalOrders())
                .totalProducts(summary.getTotalProducts())
                .totalRevenue(summary.getTotalRevenue())
                .build();
    }

    @Transactional(readOnly = true)
    public List<RevenuePointDTO> getRevenueSeries(LocalDate fromDate, LocalDate toDate, String groupBy) {
        DateRange range = resolveRange(fromDate, toDate);
        DateTimeFormatter formatter = resolveGroupBy(groupBy).equals("MONTH") ? MONTH_FORMATTER : DAY_FORMATTER;
        Map<String, List<Order>> groupedOrders = deliveredOrders(range).stream()
                .collect(Collectors.groupingBy(
                        order -> order.getOrderDate().format(formatter),
                        TreeMap::new,
                        Collectors.toList()
                ));

        return groupedOrders.entrySet().stream()
                .map(entry -> new RevenuePointDTO(entry.getKey(), sumRevenue(entry.getValue()), (long) entry.getValue().size()))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<MonthlyRevenueDTO> getMonthlyRevenue(LocalDate fromDate, LocalDate toDate) {
        return getRevenueSeries(fromDate, toDate, "MONTH").stream()
                .map(point -> new MonthlyRevenueDTO(point.getLabel(), point.getRevenue()))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<LabelValueDTO> getOrderStatusStats(LocalDate fromDate, LocalDate toDate) {
        return getSummary(fromDate, toDate).getOrdersByStatus();
    }

    @Transactional(readOnly = true)
    public List<LabelValueDTO> getMonthlyUsers(LocalDate fromDate, LocalDate toDate, String groupBy) {
        DateRange range = resolveRange(fromDate, toDate);
        DateTimeFormatter formatter = resolveGroupBy(groupBy).equals("MONTH") ? MONTH_FORMATTER : DAY_FORMATTER;
        return userRepository.findAll().stream()
                .filter(user -> user.getCreateDate() != null)
                .filter(user -> !user.getCreateDate().isBefore(range.fromDateTime()) && !user.getCreateDate().isAfter(range.toDateTime()))
                .collect(Collectors.groupingBy(
                        user -> user.getCreateDate().format(formatter),
                        TreeMap::new,
                        Collectors.counting()
                ))
                .entrySet().stream()
                .map(entry -> new LabelValueDTO(entry.getKey(), entry.getValue()))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<LabelValueDTO> getCategoryShare() {
        Map<Long, Long> productCountByCategoryId = productRepository.findAll().stream()
                .filter(product -> product.getCategory() != null)
                .collect(Collectors.groupingBy(product -> product.getCategory().getId(), Collectors.counting()));

        return categoryRepository.findAll().stream()
                .map(category -> new LabelValueDTO(
                        category.getCategoryName(),
                        productCountByCategoryId.getOrDefault(category.getId(), 0L)
                ))
                .sorted(Comparator.comparing(LabelValueDTO::getValue).reversed())
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public byte[] exportRevenueReport(LocalDate fromDate, LocalDate toDate, String groupBy) {
        DateRange range = resolveRange(fromDate, toDate);
        DashboardSummaryDTO summary = getSummary(range.fromDate(), range.toDate());
        List<RevenuePointDTO> revenueSeries = getRevenueSeries(range.fromDate(), range.toDate(), groupBy);
        List<RevenueReportRowDTO> reportRows = deliveredOrders(range).stream()
                .map(order -> new RevenueReportRowDTO(
                        order.getId(),
                        order.getOrderDate(),
                        order.getUser() != null ? order.getUser().getUsername() : "",
                        order.getReceiverName(),
                        order.getStatus(),
                        safePrice(order)
                ))
                .collect(Collectors.toList());
        ReportContext context = new ReportContext(
                UUID.randomUUID().toString(),
                LocalDateTime.now(),
                currentUsername(),
                resolveGroupBy(groupBy),
                "Trạng thái = " + displayStatus(DELIVERED) + "; Nhóm theo = " + displayGroupBy(resolveGroupBy(groupBy))
        );

        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            ReportStyles styles = createReportStyles(workbook);
            writeSummarySheet(workbook, styles, range, summary, revenueSeries, context);
            writeDetailSheet(workbook, styles, reportRows, context);
            writeMetadataSheet(workbook, range, reportRows, context);
            workbook.write(out);
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Không thể xuất báo cáo doanh thu: " + e.getMessage());
        }
    }

    public String buildReportFilename(LocalDate fromDate, LocalDate toDate) {
        DateRange range = resolveRange(fromDate, toDate);
        DateTimeFormatter formatter = DateTimeFormatter.BASIC_ISO_DATE;
        return "revenue-report-" + range.fromDate().format(formatter) + "-" + range.toDate().format(formatter) + ".xlsx";
    }

    private List<Order> deliveredOrders(DateRange range) {
        return orderRepository.findDeliveredOrdersForReport(
                DELIVERED,
                range.fromDateTime(),
                range.toDateTime()
        );
    }

    private DateRange resolveRange(LocalDate fromDate, LocalDate toDate) {
        LocalDate today = LocalDate.now();
        LocalDate defaultFrom = today.withDayOfMonth(1);
        LocalDate from = fromDate != null ? fromDate : defaultFrom;
        LocalDate to = toDate != null ? toDate : today;
        if (from.isAfter(to)) {
            LocalDate swap = from;
            from = to;
            to = swap;
        }
        return new DateRange(from, to, from.atStartOfDay(), to.atTime(LocalTime.MAX));
    }

    private String resolveGroupBy(String groupBy) {
        return "MONTH".equalsIgnoreCase(groupBy) ? "MONTH" : "DAY";
    }

    private double sumRevenue(List<Order> orders) {
        return orders.stream().mapToDouble(this::safePrice).sum();
    }

    private double safePrice(Order order) {
        return order.getTotalPrice() != null ? order.getTotalPrice() : 0;
    }

    private String currentUsername() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication.getName() == null || "anonymousUser".equals(authentication.getName())) {
            return "Hệ thống";
        }
        return authentication.getName();
    }

    private void writeSummarySheet(Workbook workbook, ReportStyles styles, DateRange range, DashboardSummaryDTO summary, List<RevenuePointDTO> revenueSeries, ReportContext context) {
        Sheet sheet = workbook.createSheet("Tổng quan");
        sheet.createFreezePane(0, 11);
        sheet.addMergedRegion(new CellRangeAddress(0, 0, 0, 4));

        Row title = sheet.createRow(0);
        title.setHeightInPoints(28);
        Cell titleCell = title.createCell(0);
        titleCell.setCellValue("BÁO CÁO DOANH THU");
        titleCell.setCellStyle(styles.title());

        Row period = sheet.createRow(1);
        period.createCell(0).setCellValue("Khoảng thời gian");
        period.getCell(0).setCellStyle(styles.label());
        period.createCell(1).setCellValue(range.fromDate().format(REPORT_DATE_FORMATTER) + " - " + range.toDate().format(REPORT_DATE_FORMATTER));
        period.getCell(1).setCellStyle(styles.value());

        writeInfoRow(sheet, styles, 2, "Thời điểm tạo", context.generatedAt().format(REPORT_DATE_TIME_FORMATTER));
        writeInfoRow(sheet, styles, 3, "Người tạo", context.generatedBy());
        writeInfoRow(sheet, styles, 4, "Bộ lọc xuất", context.appliedFilters());

        writeKpiRow(sheet, styles, 6, "Tổng doanh thu", summary.getTotalRevenue(), "Số đơn đã giao", summary.getDeliveredOrders());
        writeKpiRow(sheet, styles, 7, "Giá trị đơn TB", summary.getAverageOrderValue(), "Khách hàng mới", summary.getNewUsers());

        Row header = sheet.createRow(10);
        header.setHeightInPoints(22);
        writeHeader(header, styles, "Thời gian", "Doanh thu", "Số đơn");
        int rowIndex = 11;
        for (RevenuePointDTO point : revenueSeries) {
            Row row = sheet.createRow(rowIndex++);
            row.setHeightInPoints(20);
            writeTextCell(row, 0, formatRevenueLabel(point.getLabel(), context.groupBy()), styles.body());
            writeNumberCell(row, 1, point.getRevenue(), styles.money());
            writeNumberCell(row, 2, point.getOrderCount(), styles.numberRight());
        }
        applyPrintSettings(workbook, sheet, "BÁO CÁO DOANH THU", 10);
        autosize(sheet, 5);
    }

    private void writeDetailSheet(Workbook workbook, ReportStyles styles, List<RevenueReportRowDTO> rows, ReportContext context) {
        Sheet sheet = workbook.createSheet("Chi tiết đơn");
        sheet.createFreezePane(0, 1);

        Row header = sheet.createRow(0);
        header.setHeightInPoints(24);
        writeHeader(header, styles, "Mã đơn", "Ngày đặt", "Khách hàng", "Người nhận", "Trạng thái", "Tổng tiền");
        sheet.setAutoFilter(new CellRangeAddress(0, 0, 0, 5));

        int rowIndex = 1;
        for (RevenueReportRowDTO reportRow : rows) {
            Row row = sheet.createRow(rowIndex++);
            row.setHeightInPoints(20);
            boolean alternate = row.getRowNum() % 2 == 0;
            writeNumberCell(row, 0, reportRow.getOrderId(), alternate ? styles.centerAlternate() : styles.center());
            writeTextCell(row, 1, reportRow.getOrderDate() != null ? reportRow.getOrderDate().format(REPORT_DATE_TIME_FORMATTER) : "", alternate ? styles.bodyAlternate() : styles.body());
            writeTextCell(row, 2, reportRow.getCustomerName(), alternate ? styles.bodyAlternate() : styles.body());
            writeTextCell(row, 3, reportRow.getReceiverName(), alternate ? styles.bodyAlternate() : styles.body());
            writeTextCell(row, 4, displayStatus(reportRow.getStatus()), alternate ? styles.centerAlternate() : styles.center());
            writeNumberCell(row, 5, reportRow.getTotalPrice(), alternate ? styles.moneyAlternate() : styles.money());
        }
        applyStatusConditionalFormatting(sheet, Math.max(rowIndex - 1, 1));

        int footerStart = rowIndex + 1;
        double totalRevenue = rows.stream().mapToDouble(RevenueReportRowDTO::getTotalPrice).sum();
        writeTextCell(sheet.createRow(footerStart), 0, "Tổng số đơn:", styles.kpiLabel());
        writeNumberCell(sheet.getRow(footerStart), 1, rows.size(), styles.kpiValue());
        writeTextCell(sheet.createRow(footerStart + 1), 0, "Tổng doanh thu:", styles.kpiLabel());
        writeNumberCell(sheet.getRow(footerStart + 1), 1, totalRevenue, styles.kpiMoney());
        Row generatedBy = sheet.createRow(footerStart + 3);
        sheet.addMergedRegion(new CellRangeAddress(footerStart + 3, footerStart + 3, 0, 5));
        writeTextCell(generatedBy, 0, "Được tạo bởi Hệ thống quản lý thương mại điện tử", styles.footer());

        applyPrintSettings(workbook, sheet, "CHI TIẾT ĐƠN HÀNG", 0);
        autosize(sheet, 6);
    }

    private void writeMetadataSheet(Workbook workbook, DateRange range, List<RevenueReportRowDTO> rows, ReportContext context) {
        Sheet sheet = workbook.createSheet("_Metadata");
        String[][] metadata = {
                {"Mã báo cáo", context.reportId()},
                {"Thời điểm tạo", context.generatedAt().format(REPORT_DATE_TIME_FORMATTER)},
                {"Người tạo", context.generatedBy()},
                {"Từ ngày", range.fromDate().format(REPORT_DATE_FORMATTER)},
                {"Đến ngày", range.toDate().format(REPORT_DATE_FORMATTER)},
                {"Bộ lọc áp dụng", context.appliedFilters()},
                {"Tổng số bản ghi", String.valueOf(rows.size())},
                {"Phiên bản xuất", "1.0"}
        };
        for (int i = 0; i < metadata.length; i++) {
            Row row = sheet.createRow(i);
            row.createCell(0).setCellValue(metadata[i][0]);
            row.createCell(1).setCellValue(metadata[i][1]);
        }
        autosize(sheet, 2);
        workbook.setSheetHidden(workbook.getSheetIndex(sheet), true);
    }

    private void writeInfoRow(Sheet sheet, ReportStyles styles, int rowIndex, String label, String value) {
        Row row = sheet.createRow(rowIndex);
        row.setHeightInPoints(20);
        writeTextCell(row, 0, label, styles.label());
        writeTextCell(row, 1, value, styles.value());
    }

    private void writeKpiRow(Sheet sheet, ReportStyles styles, int rowIndex, String leftLabel, double leftValue, String rightLabel, long rightValue) {
        Row row = sheet.createRow(rowIndex);
        row.setHeightInPoints(24);
        writeTextCell(row, 0, leftLabel, styles.kpiLabel());
        writeNumberCell(row, 1, leftValue, styles.kpiMoney());
        writeTextCell(row, 3, rightLabel, styles.kpiLabel());
        writeNumberCell(row, 4, rightValue, styles.kpiValue());
    }

    private void writeHeader(Row row, ReportStyles styles, String... headers) {
        for (int i = 0; i < headers.length; i++) {
            Cell cell = row.createCell(i);
            cell.setCellValue(headers[i]);
            cell.setCellStyle(styles.header());
        }
    }

    private void writeTextCell(Row row, int index, String value, CellStyle style) {
        Cell cell = row.createCell(index);
        cell.setCellValue(value != null ? value : "");
        cell.setCellStyle(style);
    }

    private void writeNumberCell(Row row, int index, Number value, CellStyle style) {
        Cell cell = row.createCell(index);
        cell.setCellValue(value != null ? value.doubleValue() : 0);
        cell.setCellStyle(style);
    }

    private void autosize(Sheet sheet, int columns) {
        for (int i = 0; i < columns; i++) {
            try {
                sheet.autoSizeColumn(i);
                sheet.setColumnWidth(i, Math.min(Math.max(sheet.getColumnWidth(i) + 800, 3200), 12000));
            } catch (RuntimeException ignored) {
                sheet.setColumnWidth(i, 5200);
            }
        }
    }

    private String formatRevenueLabel(String label, String groupBy) {
        if (label == null || label.isBlank()) {
            return "";
        }
        try {
            if ("MONTH".equals(groupBy)) {
                return LocalDate.parse(label + "-01", DAY_FORMATTER).format(DateTimeFormatter.ofPattern("MM/yyyy"));
            }
            return LocalDate.parse(label, DAY_FORMATTER).format(REPORT_DATE_FORMATTER);
        } catch (DateTimeParseException ignored) {
            return label;
        }
    }

    private String displayGroupBy(String groupBy) {
        return "MONTH".equals(groupBy) ? "Tháng" : "Ngày";
    }

    private String displayStatus(String status) {
        if (status == null || status.isBlank()) {
            return "";
        }
        return switch (status) {
            case "DELIVERED" -> "Đã giao";
            case "PENDING" -> "Chờ xử lý";
            case "PROCESSING" -> "Đang xử lý";
            case "CANCELLED" -> "Đã hủy";
            case "REFUNDED" -> "Hoàn tiền";
            default -> status;
        };
    }

    private void applyStatusConditionalFormatting(Sheet sheet, int lastRow) {
        SheetConditionalFormatting formatting = sheet.getSheetConditionalFormatting();
        CellRangeAddress[] statusRange = {new CellRangeAddress(1, lastRow, 4, 4)};
        addStatusRule(formatting, statusRange, "Đã giao", IndexedColors.LIGHT_GREEN, IndexedColors.DARK_GREEN);
        addStatusRule(formatting, statusRange, "Chờ xử lý", IndexedColors.LIGHT_YELLOW, IndexedColors.DARK_YELLOW);
        addStatusRule(formatting, statusRange, "Đang xử lý", IndexedColors.PALE_BLUE, IndexedColors.BLUE);
        addStatusRule(formatting, statusRange, "Đã hủy", IndexedColors.ROSE, IndexedColors.RED);
        addStatusRule(formatting, statusRange, "Hoàn tiền", IndexedColors.LIGHT_ORANGE, IndexedColors.ORANGE);
    }

    private void addStatusRule(SheetConditionalFormatting formatting, CellRangeAddress[] range, String status, IndexedColors fillColor, IndexedColors fontColor) {
        ConditionalFormattingRule rule = formatting.createConditionalFormattingRule("EXACT($E2,\"" + status + "\")");
        PatternFormatting pattern = rule.createPatternFormatting();
        pattern.setFillForegroundColor(fillColor.getIndex());
        pattern.setFillPattern(PatternFormatting.SOLID_FOREGROUND);
        FontFormatting font = rule.createFontFormatting();
        font.setFontColorIndex(fontColor.getIndex());
        font.setFontStyle(true, false);
        formatting.addConditionalFormatting(range, rule);
    }

    private void applyPrintSettings(Workbook workbook, Sheet sheet, String reportTitle, int repeatHeaderRow) {
        PrintSetup printSetup = sheet.getPrintSetup();
        printSetup.setPaperSize(PrintSetup.A4_PAPERSIZE);
        printSetup.setLandscape(true);
        printSetup.setFitWidth((short) 1);
        printSetup.setFitHeight((short) 0);
        sheet.setFitToPage(true);
        sheet.setMargin(Sheet.TopMargin, 0.5);
        sheet.setMargin(Sheet.BottomMargin, 0.5);
        sheet.setMargin(Sheet.LeftMargin, 0.35);
        sheet.setMargin(Sheet.RightMargin, 0.35);
        Header header = sheet.getHeader();
        header.setCenter(reportTitle);
        Footer footer = sheet.getFooter();
        footer.setCenter("Trang &P / &N");
        sheet.setRepeatingRows(CellRangeAddress.valueOf((repeatHeaderRow + 1) + ":" + (repeatHeaderRow + 1)));
    }

    private ReportStyles createReportStyles(Workbook workbook) {
        Font titleFont = workbook.createFont();
        titleFont.setBold(true);
        titleFont.setFontHeightInPoints((short) 16);
        titleFont.setColor(IndexedColors.DARK_BLUE.getIndex());

        Font headerFont = workbook.createFont();
        headerFont.setBold(true);
        headerFont.setColor(IndexedColors.WHITE.getIndex());

        Font boldFont = workbook.createFont();
        boldFont.setBold(true);

        Font footerFont = workbook.createFont();
        footerFont.setItalic(true);
        footerFont.setColor(IndexedColors.GREY_50_PERCENT.getIndex());

        CellStyle title = workbook.createCellStyle();
        title.setFont(titleFont);
        title.setAlignment(HorizontalAlignment.CENTER);
        title.setVerticalAlignment(VerticalAlignment.CENTER);

        CellStyle header = bordered(workbook);
        header.setFont(headerFont);
        header.setFillForegroundColor(IndexedColors.DARK_BLUE.getIndex());
        header.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        header.setAlignment(HorizontalAlignment.CENTER);

        CellStyle label = bordered(workbook);
        label.setFont(boldFont);
        label.setFillForegroundColor(IndexedColors.PALE_BLUE.getIndex());
        label.setFillPattern(FillPatternType.SOLID_FOREGROUND);

        CellStyle value = bordered(workbook);
        value.setAlignment(HorizontalAlignment.LEFT);

        CellStyle body = bordered(workbook);
        body.setAlignment(HorizontalAlignment.LEFT);

        CellStyle numberRight = bordered(workbook);
        numberRight.setAlignment(HorizontalAlignment.RIGHT);

        CellStyle center = bordered(workbook);
        center.setAlignment(HorizontalAlignment.CENTER);

        CellStyle money = bordered(workbook);
        money.setDataFormat(workbook.createDataFormat().getFormat("#,##0 \"đ\""));
        money.setAlignment(HorizontalAlignment.RIGHT);

        CellStyle kpiLabel = bordered(workbook);
        kpiLabel.setFont(boldFont);
        kpiLabel.setFillForegroundColor(IndexedColors.PALE_BLUE.getIndex());
        kpiLabel.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        kpiLabel.setAlignment(HorizontalAlignment.LEFT);

        CellStyle kpiMoney = bordered(workbook);
        kpiMoney.setDataFormat(workbook.createDataFormat().getFormat("#,##0 \"đ\""));
        kpiMoney.setFillForegroundColor(IndexedColors.LIGHT_YELLOW.getIndex());
        kpiMoney.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        kpiMoney.setAlignment(HorizontalAlignment.RIGHT);

        CellStyle kpiValue = bordered(workbook);
        kpiValue.setFillForegroundColor(IndexedColors.LIGHT_YELLOW.getIndex());
        kpiValue.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        kpiValue.setAlignment(HorizontalAlignment.CENTER);

        CellStyle bodyAlternate = workbook.createCellStyle();
        bodyAlternate.cloneStyleFrom(body);
        bodyAlternate.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
        bodyAlternate.setFillPattern(FillPatternType.SOLID_FOREGROUND);

        CellStyle centerAlternate = workbook.createCellStyle();
        centerAlternate.cloneStyleFrom(center);
        centerAlternate.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
        centerAlternate.setFillPattern(FillPatternType.SOLID_FOREGROUND);

        CellStyle moneyAlternate = workbook.createCellStyle();
        moneyAlternate.cloneStyleFrom(money);
        moneyAlternate.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
        moneyAlternate.setFillPattern(FillPatternType.SOLID_FOREGROUND);

        CellStyle footer = workbook.createCellStyle();
        footer.setFont(footerFont);
        footer.setAlignment(HorizontalAlignment.CENTER);

        return new ReportStyles(title, header, label, value, body, numberRight, center, money, kpiLabel, kpiMoney, kpiValue, bodyAlternate, centerAlternate, moneyAlternate, footer);
    }

    private CellStyle bordered(Workbook workbook) {
        CellStyle style = workbook.createCellStyle();
        style.setBorderTop(BorderStyle.THIN);
        style.setBorderRight(BorderStyle.THIN);
        style.setBorderBottom(BorderStyle.THIN);
        style.setBorderLeft(BorderStyle.THIN);
        style.setVerticalAlignment(VerticalAlignment.CENTER);
        return style;
    }

    private record DateRange(LocalDate fromDate, LocalDate toDate, LocalDateTime fromDateTime, LocalDateTime toDateTime) {}

    private record ReportContext(String reportId, LocalDateTime generatedAt, String generatedBy, String groupBy, String appliedFilters) {}

    private record ReportStyles(
            CellStyle title,
            CellStyle header,
            CellStyle label,
            CellStyle value,
            CellStyle body,
            CellStyle numberRight,
            CellStyle center,
            CellStyle money,
            CellStyle kpiLabel,
            CellStyle kpiMoney,
            CellStyle kpiValue,
            CellStyle bodyAlternate,
            CellStyle centerAlternate,
            CellStyle moneyAlternate,
            CellStyle footer
    ) {}
}
