package com.laptop.laptopstore.repositories;

import com.laptop.laptopstore.models.Order;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;

public class OrderSpecification {
    public static Specification<Order> filter(String status, String keyword) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (StringUtils.hasText(status)) {
                predicates.add(cb.equal(root.get("status"), status));
            }

            if (StringUtils.hasText(keyword)) {
                String likeKeyword = "%" + keyword.toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("receiverName")), likeKeyword),
                        cb.like(cb.lower(root.get("receiverPhone")), likeKeyword),
                        cb.like(cb.lower(root.get("receiverAddress")), likeKeyword),
                        cb.like(cb.lower(root.get("user").get("username")), likeKeyword)
                ));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
