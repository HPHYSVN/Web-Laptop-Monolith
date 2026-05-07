package com.laptop.laptopstore.controllers;

import com.laptop.laptopstore.dtos.*;
import com.laptop.laptopstore.services.SpecService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/specs")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class SpecController {

    private final SpecService specService;

    // CPU
    @GetMapping("/cpu")
    public ResponseEntity<?> getAllCpus() { return ResponseEntity.ok(specService.getAllCpus()); }

    @PostMapping("/cpu")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createCpu(@RequestBody CpuInforDTO dto) { return ResponseEntity.ok(specService.createCpu(dto)); }

    // RAM
    @GetMapping("/ram")
    public ResponseEntity<?> getAllRams() { return ResponseEntity.ok(specService.getAllRams()); }

    @PostMapping("/ram")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createRam(@RequestBody RamInforDTO dto) { return ResponseEntity.ok(specService.createRam(dto)); }

    // GPU
    @GetMapping("/gpu")
    public ResponseEntity<?> getAllGpus() { return ResponseEntity.ok(specService.getAllGpus()); }

    @PostMapping("/gpu")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createGpu(@RequestBody GpuInforDTO dto) { return ResponseEntity.ok(specService.createGpu(dto)); }

    // SCREEN
    @GetMapping("/screen")
    public ResponseEntity<?> getAllScreens() { return ResponseEntity.ok(specService.getAllScreens()); }

    @PostMapping("/screen")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createScreen(@RequestBody ScreenInforDTO dto) { return ResponseEntity.ok(specService.createScreen(dto)); }

    // STORAGE
    @GetMapping("/storage")
    public ResponseEntity<?> getAllStorages() { return ResponseEntity.ok(specService.getAllStorages()); }

    @PostMapping("/storage")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createStorage(@RequestBody StorageInforDTO dto) { return ResponseEntity.ok(specService.createStorage(dto)); }
}
