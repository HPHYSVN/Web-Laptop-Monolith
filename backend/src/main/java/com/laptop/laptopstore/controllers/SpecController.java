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

    @PutMapping("/cpu/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateCpu(@PathVariable Long id, @RequestBody CpuInforDTO dto) {
        try {
            return ResponseEntity.ok(specService.updateCpu(id, dto));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/cpu/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteCpu(@PathVariable Long id) {
        specService.deleteCpu(id);
        return ResponseEntity.ok("Xóa CPU thành công!");
    }

    // RAM
    @GetMapping("/ram")
    public ResponseEntity<?> getAllRams() { return ResponseEntity.ok(specService.getAllRams()); }

    @PostMapping("/ram")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createRam(@RequestBody RamInforDTO dto) { return ResponseEntity.ok(specService.createRam(dto)); }

    @PutMapping("/ram/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateRam(@PathVariable Long id, @RequestBody RamInforDTO dto) {
        try {
            return ResponseEntity.ok(specService.updateRam(id, dto));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/ram/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteRam(@PathVariable Long id) {
        specService.deleteRam(id);
        return ResponseEntity.ok("Xóa RAM thành công!");
    }

    // GPU
    @GetMapping("/gpu")
    public ResponseEntity<?> getAllGpus() { return ResponseEntity.ok(specService.getAllGpus()); }

    @PostMapping("/gpu")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createGpu(@RequestBody GpuInforDTO dto) { return ResponseEntity.ok(specService.createGpu(dto)); }

    @PutMapping("/gpu/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateGpu(@PathVariable Long id, @RequestBody GpuInforDTO dto) {
        try {
            return ResponseEntity.ok(specService.updateGpu(id, dto));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/gpu/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteGpu(@PathVariable Long id) {
        specService.deleteGpu(id);
        return ResponseEntity.ok("Xóa GPU thành công!");
    }

    // SCREEN
    @GetMapping("/screen")
    public ResponseEntity<?> getAllScreens() { return ResponseEntity.ok(specService.getAllScreens()); }

    @PostMapping("/screen")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createScreen(@RequestBody ScreenInforDTO dto) { return ResponseEntity.ok(specService.createScreen(dto)); }

    @PutMapping("/screen/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateScreen(@PathVariable Long id, @RequestBody ScreenInforDTO dto) {
        try {
            return ResponseEntity.ok(specService.updateScreen(id, dto));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/screen/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteScreen(@PathVariable Long id) {
        specService.deleteScreen(id);
        return ResponseEntity.ok("Xóa Screen thành công!");
    }

    // STORAGE
    @GetMapping("/storage")
    public ResponseEntity<?> getAllStorages() { return ResponseEntity.ok(specService.getAllStorages()); }

    @PostMapping("/storage")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createStorage(@RequestBody StorageInforDTO dto) { return ResponseEntity.ok(specService.createStorage(dto)); }

    @PutMapping("/storage/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateStorage(@PathVariable Long id, @RequestBody StorageInforDTO dto) {
        try {
            return ResponseEntity.ok(specService.updateStorage(id, dto));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/storage/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteStorage(@PathVariable Long id) {
        specService.deleteStorage(id);
        return ResponseEntity.ok("Xóa Storage thành công!");
    }
}
