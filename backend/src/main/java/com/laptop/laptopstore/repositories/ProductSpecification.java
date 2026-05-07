package com.laptop.laptopstore.repositories;

import com.laptop.laptopstore.dtos.ProductFilterDTO;
import com.laptop.laptopstore.models.*;
import jakarta.persistence.criteria.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;

public class ProductSpecification {

    public static Specification<Product> filterProducts(ProductFilterDTO filter) {
        return (Root<Product> root, CriteriaQuery<?> query, CriteriaBuilder cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // 1. Lọc theo Keyword (Tên sản phẩm)
            if (StringUtils.hasText(filter.getKeyword())) {
                predicates.add(cb.like(cb.lower(root.get("productName")), "%" + filter.getKeyword().toLowerCase() + "%"));
            }

            // 2. Lọc theo Danh mục
            if (filter.getCategoryId() != null) {
                predicates.add(cb.equal(root.get("category").get("id"), filter.getCategoryId()));
            }

            // 3. Lọc nâng cao liên quan tới ProductDetail (Giá, Cấu hình)
            boolean hasDetailFilter = filter.getMinPrice() != null || filter.getMaxPrice() != null ||
                    StringUtils.hasText(filter.getRamSize()) || StringUtils.hasText(filter.getCpuBrand()) ||
                    StringUtils.hasText(filter.getStorageCapacity());

            if (hasDetailFilter) {
                Subquery<Long> subquery = query.subquery(Long.class);
                Root<ProductDetail> pdRoot = subquery.from(ProductDetail.class);
                subquery.select(pdRoot.get("product").get("id"));

                List<Predicate> subPredicates = new ArrayList<>();

                // Lọc khoảng giá
                if (filter.getMinPrice() != null) {
                    subPredicates.add(cb.greaterThanOrEqualTo(pdRoot.get("price"), filter.getMinPrice()));
                }
                if (filter.getMaxPrice() != null) {
                    subPredicates.add(cb.lessThanOrEqualTo(pdRoot.get("price"), filter.getMaxPrice()));
                }

                // Lọc theo RAM, CPU, Ổ cứng (Join qua ProductsSpecs)
                if (StringUtils.hasText(filter.getRamSize()) || StringUtils.hasText(filter.getCpuBrand()) || StringUtils.hasText(filter.getStorageCapacity())) {
                    Join<ProductDetail, ProductsSpecs> specsJoin = pdRoot.join("productsSpecs", JoinType.INNER);

                    if (StringUtils.hasText(filter.getRamSize())) {
                        Join<ProductsSpecs, RamInfor> ramJoin = specsJoin.join("ram", JoinType.INNER);
                        subPredicates.add(cb.equal(ramJoin.get("size"), filter.getRamSize()));
                    }

                    if (StringUtils.hasText(filter.getCpuBrand())) {
                        Join<ProductsSpecs, CpuInfor> cpuJoin = specsJoin.join("cpu", JoinType.INNER);
                        subPredicates.add(cb.like(cb.lower(cpuJoin.get("brands")), "%" + filter.getCpuBrand().toLowerCase() + "%"));
                    }

                    if (StringUtils.hasText(filter.getStorageCapacity())) {
                        Join<ProductsSpecs, StorageInfor> storageJoin = specsJoin.join("storage", JoinType.INNER);
                        subPredicates.add(cb.equal(storageJoin.get("capacity"), filter.getStorageCapacity()));
                    }
                }

                subquery.where(cb.and(subPredicates.toArray(new Predicate[0])));
                predicates.add(root.get("id").in(subquery));
            }

            // Dùng DISTINCT để tránh lặp sản phẩm
            query.distinct(true);

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
