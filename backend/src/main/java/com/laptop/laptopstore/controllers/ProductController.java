package com.laptop.laptopstore.controllers;

import com.laptop.laptopstore.dtos.BulkDeleteRequestDTO;
import com.laptop.laptopstore.dtos.ProductFilterDTO;
import com.laptop.laptopstore.dtos.ProductRequestDTO;
import com.laptop.laptopstore.services.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ProductController {
    private final ProductService productService;

    @GetMapping
    public ResponseEntity<?> getAllProducts(
            @RequestParam(required = false) Integer page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false) String sortBy,
            @RequestParam(required = false) String sortOrder
    ) {
        if (page != null) {
            ProductFilterDTO filter = new ProductFilterDTO();
            filter.setKeyword(keyword);
            filter.setCategoryId(categoryId);
            filter.setMinPrice(minPrice);
            filter.setMaxPrice(maxPrice);
            filter.setSortBy(sortBy);
            filter.setSortOrder(sortOrder);
            return ResponseEntity.ok(productService.getProductsPage(page, size, filter));
        }
        return ResponseEntity.ok(productService.getAllProducts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getProductById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<?> getProductsByCategory(@PathVariable Long categoryId) {
        return ResponseEntity.ok(productService.getProductsByCategory(categoryId));
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchProducts(@RequestParam String keyword) {
        return ResponseEntity.ok(productService.searchProducts(keyword));
    }

    @PostMapping("/filter")
    public ResponseEntity<?> filterProducts(@RequestBody com.laptop.laptopstore.dtos.ProductFilterDTO filterDTO) {
        return ResponseEntity.ok(productService.filterProducts(filterDTO));
    }

    // ADMIN APIs
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<?> createProduct(@Valid @RequestBody ProductRequestDTO request) {
        return ResponseEntity.ok(productService.createProduct(request));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<?> updateProduct(@PathVariable Long id, @Valid @RequestBody ProductRequestDTO request) {
        return ResponseEntity.ok(productService.updateProduct(id, request));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/bulk")
    public ResponseEntity<?> deleteProducts(@Valid @RequestBody BulkDeleteRequestDTO request) {
        productService.deleteProducts(request.getIds());
        return ResponseEntity.ok(Map.of("message", "Xóa sản phẩm đã chọn thành công!"));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping(value = "/import", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> importProducts(@RequestPart("file") MultipartFile file) {
        int imported = productService.importProducts(file);
        return ResponseEntity.ok(Map.of("imported", imported, "message", "Import sản phẩm thành công!"));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/export")
    public ResponseEntity<byte[]> exportProducts(@RequestParam(defaultValue = "csv") String format) {
        boolean xlsx = "xlsx".equalsIgnoreCase(format);
        byte[] data = productService.exportProducts(xlsx ? "xlsx" : "csv");
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=products." + (xlsx ? "xlsx" : "csv"))
                .contentType(xlsx
                        ? MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
                        : MediaType.parseMediaType("text/csv"))
                .body(data);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok(java.util.Collections.singletonMap("message", "Xóa sản phẩm thành công!"));
    }
}
