package com.laptop.laptopstore.repositories;

import com.laptop.laptopstore.models.GpuInfor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GpuInforRepository extends JpaRepository<GpuInfor, Long> {
}
