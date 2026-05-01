package com.laptop.laptopstore.services;

import com.laptop.laptopstore.models.Product;
import com.laptop.laptopstore.models.ProductDetail;
import com.laptop.laptopstore.repositories.ProductDetailRepository;
import com.laptop.laptopstore.repositories.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {
    private final ProductRepository productRepository;
    private final ProductDetailRepository productDetailRepository;

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Product getProductById(Long id) {
        return productRepository.findById(id).orElse(null);
    }

    public List<Product> getProductsByCategory(Long categoryId) {
        return productRepository.findByCategoryId(categoryId);
    }

    public List<Product> searchProducts(String keyword) {
        return productRepository.findByProductNameContainingIgnoreCase(keyword);
    }

    public List<ProductDetail> getProductDetails(Long productId) {
        return productDetailRepository.findByProductId(productId);
    }
}
