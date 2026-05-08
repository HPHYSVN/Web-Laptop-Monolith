package com.laptop.laptopstore.services;

import com.laptop.laptopstore.dtos.DiscountDTO;
import com.laptop.laptopstore.models.Discount;
import com.laptop.laptopstore.repositories.DiscountRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DiscountService {
    private final DiscountRepository discountRepository;

    public DiscountService(DiscountRepository discountRepository) {
        this.discountRepository = discountRepository;
    }

    private String getStatus(Discount discount) {
        LocalDateTime now = LocalDateTime.now();
        if (now.isBefore(discount.getStartDate())) {
            return "FUTURE";
        } else if (now.isAfter(discount.getEndDate())) {
            return "EXPIRED";
        } else {
            return "ACTIVE";
        }
    }

    private DiscountDTO convertToDTO(Discount discount) {
        DiscountDTO dto = new DiscountDTO();
        dto.setId(discount.getId());
        dto.setCode(discount.getCode());
        dto.setDiscountPercent(discount.getDiscountPercent());
        dto.setMaxPercent(discount.getMaxPercent());
        dto.setStartDate(discount.getStartDate());
        dto.setEndDate(discount.getEndDate());
        dto.setDescription(discount.getDescription());
        dto.setQuantity(discount.getQuantity());
        dto.setStatus(getStatus(discount));
        return dto;
    }

    public List<DiscountDTO> getAllDiscounts() {
        return discountRepository.findAll().stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public DiscountDTO getDiscountById(Long id) {
        Discount discount = discountRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Discount not found"));
        return convertToDTO(discount);
    }

    public DiscountDTO createDiscount(DiscountDTO request) {
        if (discountRepository.findByCode(request.getCode()).isPresent()) {
            throw new RuntimeException("Discount code already exists");
        }
        Discount discount = new Discount();
        discount.setCode(request.getCode());
        discount.setDiscountPercent(request.getDiscountPercent());
        discount.setMaxPercent(request.getMaxPercent());
        discount.setStartDate(request.getStartDate());
        discount.setEndDate(request.getEndDate());
        discount.setDescription(request.getDescription());
        discount.setQuantity(request.getQuantity());
        return convertToDTO(discountRepository.save(discount));
    }

    public DiscountDTO updateDiscount(Long id, DiscountDTO request) {
        Discount discount = discountRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Discount not found"));
        
        if (!discount.getCode().equals(request.getCode())) {
            if (discountRepository.findByCode(request.getCode()).isPresent()) {
                throw new RuntimeException("Discount code already exists");
            }
        }
        
        discount.setCode(request.getCode());
        discount.setDiscountPercent(request.getDiscountPercent());
        discount.setMaxPercent(request.getMaxPercent());
        discount.setStartDate(request.getStartDate());
        discount.setEndDate(request.getEndDate());
        discount.setDescription(request.getDescription());
        discount.setQuantity(request.getQuantity());
        return convertToDTO(discountRepository.save(discount));
    }

    public void deleteDiscount(Long id) {
        discountRepository.deleteById(id);
    }
}
