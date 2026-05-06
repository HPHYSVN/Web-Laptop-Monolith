package com.laptop.laptopstore.services;

import com.laptop.laptopstore.dtos.ProductDTO;
import com.laptop.laptopstore.dtos.ProductRequestDTO;
import com.laptop.laptopstore.models.Category;
import com.laptop.laptopstore.models.Product;
import com.laptop.laptopstore.models.ProductDetail;
import com.laptop.laptopstore.repositories.CategoryRepository;
import com.laptop.laptopstore.repositories.ProductDetailRepository;
import com.laptop.laptopstore.repositories.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {
    private final ProductRepository productRepository;
    private final ProductDetailRepository productDetailRepository;
    private final CategoryRepository categoryRepository;

    private ProductDTO convertToDTO(Product product) {
        return ProductDTO.builder()
                .id(product.getId())
                .productName(product.getProductName())
                .productDescription(product.getProductDescription())
                .createDate(product.getCreateDate())
                .categoryName(product.getCategory() != null ? product.getCategory().getCategoryName() : null)
                .build();
    }

    public List<ProductDTO> getAllProducts() {
        return productRepository.findAll().stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public ProductDTO getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        return convertToDTO(product);
    }

    public List<ProductDTO> getProductsByCategory(Long categoryId) {
        return productRepository.findByCategoryId(categoryId).stream()
                .map(this::convertToDTO).collect(Collectors.toList());
    }

    public List<ProductDTO> searchProducts(String keyword) {
        return productRepository.findByProductNameContainingIgnoreCase(keyword).stream()
                .map(this::convertToDTO).collect(Collectors.toList());
    }

    public List<ProductDetail> getProductDetails(Long productId) {
        return productDetailRepository.findByProductId(productId);
    }

    // ADMIN APIs
    public ProductDTO createProduct(ProductRequestDTO request) {
        Category category = null;
        if (request.getCategoryId() != null) {
            category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found"));
        }

        Product product = Product.builder()
                .productName(request.getProductName())
                .productDescription(request.getProductDescription())
                .createDate(LocalDateTime.now())
                .category(category)
                .build();
        return convertToDTO(productRepository.save(product));
    }

    public ProductDTO updateProduct(Long id, ProductRequestDTO request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found"));
            product.setCategory(category);
        }

        if (request.getProductName() != null) product.setProductName(request.getProductName());
        if (request.getProductDescription() != null) product.setProductDescription(request.getProductDescription());

        return convertToDTO(productRepository.save(product));
    }

    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }
}
