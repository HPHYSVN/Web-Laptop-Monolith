package com.laptop.laptopstore.repositories;

import com.laptop.laptopstore.models.StorageInfor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StorageInforRepository extends JpaRepository<StorageInfor, Long> {
}
