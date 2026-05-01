package com.laptop.laptopstore.repositories;

import com.laptop.laptopstore.models.Statistic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;

@Repository
public interface StatisticRepository extends JpaRepository<Statistic, Long> {
    Optional<Statistic> findByDate(LocalDate date);
}
