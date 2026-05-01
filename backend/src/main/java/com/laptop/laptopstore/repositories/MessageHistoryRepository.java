package com.laptop.laptopstore.repositories;

import com.laptop.laptopstore.models.MessageHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageHistoryRepository extends JpaRepository<MessageHistory, Long> {
    List<MessageHistory> findByMessageId(Long messageId);
}
