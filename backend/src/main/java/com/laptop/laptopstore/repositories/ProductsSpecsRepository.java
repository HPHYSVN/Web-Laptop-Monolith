package com.laptop.laptopstore.repositories;

import com.laptop.laptopstore.models.ProductsSpecs;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductsSpecsRepository extends JpaRepository<ProductsSpecs, Long> {
}
