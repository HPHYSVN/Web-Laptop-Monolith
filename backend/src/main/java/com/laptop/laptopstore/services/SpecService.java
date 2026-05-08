package com.laptop.laptopstore.services;

import com.laptop.laptopstore.dtos.*;
import com.laptop.laptopstore.models.*;
import com.laptop.laptopstore.repositories.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SpecService {

    private final CpuInforRepository cpuRepo;
    private final RamInforRepository ramRepo;
    private final GpuInforRepository gpuRepo;
    private final ScreenInforRepository screenRepo;
    private final StorageInforRepository storageRepo;

    // CPU Methods
    public List<CpuInforDTO> getAllCpus() {
        return cpuRepo.findAll().stream().map(this::mapToDto).collect(Collectors.toList());
    }
    public CpuInforDTO createCpu(CpuInforDTO dto) {
        CpuInfor cpu = CpuInfor.builder().brands(dto.getBrands()).speed(dto.getSpeed())
                .model(dto.getModel()).cores(dto.getCores()).threads(dto.getThreads())
                .baseClock(dto.getBaseClock()).boostClock(dto.getBoostClock())
                .cache(dto.getCache()).build();
        return mapToDto(cpuRepo.save(cpu));
    }
    public CpuInforDTO updateCpu(Long id, CpuInforDTO dto) {
        CpuInfor cpu = cpuRepo.findById(id).orElseThrow(() -> new RuntimeException("CPU not found"));
        cpu.setBrands(dto.getBrands());
        cpu.setSpeed(dto.getSpeed());
        cpu.setModel(dto.getModel());
        cpu.setCores(dto.getCores());
        cpu.setThreads(dto.getThreads());
        cpu.setBaseClock(dto.getBaseClock());
        cpu.setBoostClock(dto.getBoostClock());
        cpu.setCache(dto.getCache());
        return mapToDto(cpuRepo.save(cpu));
    }
    public void deleteCpu(Long id) {
        cpuRepo.deleteById(id);
    }
    private CpuInforDTO mapToDto(CpuInfor cpu) {
        CpuInforDTO dto = new CpuInforDTO();
        dto.setId(cpu.getId()); dto.setBrands(cpu.getBrands()); dto.setSpeed(cpu.getSpeed());
        dto.setModel(cpu.getModel()); dto.setCores(cpu.getCores()); dto.setThreads(cpu.getThreads());
        dto.setBaseClock(cpu.getBaseClock()); dto.setBoostClock(cpu.getBoostClock()); dto.setCache(cpu.getCache());
        return dto;
    }

    // RAM Methods
    public List<RamInforDTO> getAllRams() {
        return ramRepo.findAll().stream().map(this::mapToDto).collect(Collectors.toList());
    }
    public RamInforDTO createRam(RamInforDTO dto) {
        RamInfor ram = RamInfor.builder().size(dto.getSize()).type(dto.getType())
                .bus(dto.getBus()).slots(dto.getSlots()).build();
        return mapToDto(ramRepo.save(ram));
    }
    public RamInforDTO updateRam(Long id, RamInforDTO dto) {
        RamInfor ram = ramRepo.findById(id).orElseThrow(() -> new RuntimeException("RAM not found"));
        ram.setSize(dto.getSize());
        ram.setType(dto.getType());
        ram.setBus(dto.getBus());
        ram.setSlots(dto.getSlots());
        return mapToDto(ramRepo.save(ram));
    }
    public void deleteRam(Long id) {
        ramRepo.deleteById(id);
    }
    private RamInforDTO mapToDto(RamInfor ram) {
        RamInforDTO dto = new RamInforDTO();
        dto.setId(ram.getId()); dto.setSize(ram.getSize()); dto.setType(ram.getType());
        dto.setBus(ram.getBus()); dto.setSlots(ram.getSlots());
        return dto;
    }

    // GPU Methods
    public List<GpuInforDTO> getAllGpus() {
        return gpuRepo.findAll().stream().map(this::mapToDto).collect(Collectors.toList());
    }
    public GpuInforDTO createGpu(GpuInforDTO dto) {
        GpuInfor gpu = GpuInfor.builder().brand(dto.getBrand()).model(dto.getModel())
                .vRam(dto.getVRam()).build();
        return mapToDto(gpuRepo.save(gpu));
    }
    public GpuInforDTO updateGpu(Long id, GpuInforDTO dto) {
        GpuInfor gpu = gpuRepo.findById(id).orElseThrow(() -> new RuntimeException("GPU not found"));
        gpu.setBrand(dto.getBrand());
        gpu.setModel(dto.getModel());
        gpu.setVRam(dto.getVRam());
        return mapToDto(gpuRepo.save(gpu));
    }
    public void deleteGpu(Long id) {
        gpuRepo.deleteById(id);
    }
    private GpuInforDTO mapToDto(GpuInfor gpu) {
        GpuInforDTO dto = new GpuInforDTO();
        dto.setId(gpu.getId()); dto.setBrand(gpu.getBrand());
        dto.setModel(gpu.getModel()); dto.setVRam(gpu.getVRam());
        return dto;
    }

    // Screen Methods
    public List<ScreenInforDTO> getAllScreens() {
        return screenRepo.findAll().stream().map(this::mapToDto).collect(Collectors.toList());
    }
    public ScreenInforDTO createScreen(ScreenInforDTO dto) {
        ScreenInfor screen = ScreenInfor.builder().size(dto.getSize()).resolution(dto.getResolution())
                .panel(dto.getPanel()).refreshRate(dto.getRefreshRate()).brightness(dto.getBrightness()).build();
        return mapToDto(screenRepo.save(screen));
    }
    public ScreenInforDTO updateScreen(Long id, ScreenInforDTO dto) {
        ScreenInfor screen = screenRepo.findById(id).orElseThrow(() -> new RuntimeException("Screen not found"));
        screen.setSize(dto.getSize());
        screen.setResolution(dto.getResolution());
        screen.setPanel(dto.getPanel());
        screen.setRefreshRate(dto.getRefreshRate());
        screen.setBrightness(dto.getBrightness());
        return mapToDto(screenRepo.save(screen));
    }
    public void deleteScreen(Long id) {
        screenRepo.deleteById(id);
    }
    private ScreenInforDTO mapToDto(ScreenInfor screen) {
        ScreenInforDTO dto = new ScreenInforDTO();
        dto.setId(screen.getId()); dto.setSize(screen.getSize()); dto.setResolution(screen.getResolution());
        dto.setPanel(screen.getPanel()); dto.setRefreshRate(screen.getRefreshRate()); dto.setBrightness(screen.getBrightness());
        return dto;
    }

    // Storage Methods
    public List<StorageInforDTO> getAllStorages() {
        return storageRepo.findAll().stream().map(this::mapToDto).collect(Collectors.toList());
    }
    public StorageInforDTO createStorage(StorageInforDTO dto) {
        StorageInfor storage = StorageInfor.builder().type(dto.getType())
                .capacity(dto.getCapacity()).interfaceName(dto.getInterfaceName()).build();
        return mapToDto(storageRepo.save(storage));
    }
    public StorageInforDTO updateStorage(Long id, StorageInforDTO dto) {
        StorageInfor storage = storageRepo.findById(id).orElseThrow(() -> new RuntimeException("Storage not found"));
        storage.setType(dto.getType());
        storage.setCapacity(dto.getCapacity());
        storage.setInterfaceName(dto.getInterfaceName());
        return mapToDto(storageRepo.save(storage));
    }
    public void deleteStorage(Long id) {
        storageRepo.deleteById(id);
    }
    private StorageInforDTO mapToDto(StorageInfor storage) {
        StorageInforDTO dto = new StorageInforDTO();
        dto.setId(storage.getId()); dto.setType(storage.getType());
        dto.setCapacity(storage.getCapacity()); dto.setInterfaceName(storage.getInterfaceName());
        return dto;
    }
}
