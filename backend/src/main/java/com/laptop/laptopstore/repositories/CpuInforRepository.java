package com.laptop.laptopstore.repositories;

import com.laptop.laptopstore.models.CpuInfor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CpuInforRepository extends JpaRepository<CpuInfor, Long> {
}
