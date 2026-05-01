package com.laptop.laptopstore.repositories;

import com.laptop.laptopstore.models.RamInfor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RamInforRepository extends JpaRepository<RamInfor, Long> {
}
