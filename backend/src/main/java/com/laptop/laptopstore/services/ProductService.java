package com.laptop.laptopstore.services;

import com.laptop.laptopstore.dtos.*;
import com.laptop.laptopstore.models.*;
import com.laptop.laptopstore.repositories.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {
    private final ProductRepository productRepository;
    private final ProductDetailRepository productDetailRepository;
    private final ProductsSpecsRepository productsSpecsRepository;
    private final CategoryRepository categoryRepository;
    private final CpuInforRepository cpuRepo;
    private final RamInforRepository ramRepo;
    private final StorageInforRepository storageRepo;
    private final GpuInforRepository gpuRepo;
    private final ScreenInforRepository screenRepo;

    @Transactional(readOnly = true)
    public List<ProductDTO> getAllProducts() {
        return productRepository.findAll().stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ProductDTO getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        return convertToDTO(product);
    }

    @Transactional(readOnly = true)
    public List<ProductDTO> getProductsByCategory(Long categoryId) {
        return productRepository.findByCategoryId(categoryId).stream()
                .map(this::convertToDTO).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ProductDTO> searchProducts(String keyword) {
        return productRepository.findByProductNameContainingIgnoreCase(keyword).stream()
                .map(this::convertToDTO).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ProductDTO> filterProducts(com.laptop.laptopstore.dtos.ProductFilterDTO filterDTO) {
        return productRepository.findAll(com.laptop.laptopstore.repositories.ProductSpecification.filterProducts(filterDTO))
                .stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    // ADMIN APIs
    @Transactional
    public ProductDTO createProduct(ProductRequestDTO request) {
        Category category = null;
        if (request.getCategoryId() != null) {
            category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found"));
        }

        Product product = Product.builder()
                .productName(request.getProductName())
                .productDescription(request.getProductDescription())
                .createDate(LocalDateTime.now())
                .category(category)
                .build();
        Product savedProduct = productRepository.save(product);

        if (request.getDetails() != null && !request.getDetails().isEmpty()) {
            for (ProductDetailRequestDTO detailReq : request.getDetails()) {
                ProductsSpecs specs = saveSpecs(detailReq.getSpecs());
                ProductDetail detail = ProductDetail.builder()
                        .product(savedProduct)
                        .productsSpecs(specs)
                        .quantity(detailReq.getQuantity())
                        .price(detailReq.getPrice())
                        .color(detailReq.getColor())
                        .imageDetail(detailReq.getImageDetail())
                        .build();
                productDetailRepository.save(detail);
            }
        }
        return convertToDTO(savedProduct);
    }

    @Transactional
    public ProductDTO updateProduct(Long id, ProductRequestDTO request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found"));
            product.setCategory(category);
        }

        if (request.getProductName() != null) product.setProductName(request.getProductName());
        if (request.getProductDescription() != null) product.setProductDescription(request.getProductDescription());
        Product savedProduct = productRepository.save(product);

        if (request.getDetails() != null) {
            List<ProductDetail> oldDetails = productDetailRepository.findByProductId(id);
            productDetailRepository.deleteAll(oldDetails);

            for (ProductDetailRequestDTO detailReq : request.getDetails()) {
                ProductsSpecs specs = saveSpecs(detailReq.getSpecs());
                ProductDetail detail = ProductDetail.builder()
                        .product(savedProduct)
                        .productsSpecs(specs)
                        .quantity(detailReq.getQuantity())
                        .price(detailReq.getPrice())
                        .color(detailReq.getColor())
                        .imageDetail(detailReq.getImageDetail())
                        .build();
                productDetailRepository.save(detail);
            }
        }
        
        return convertToDTO(savedProduct);
    }

    @Transactional
    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }

    private ProductsSpecs saveSpecs(ProductSpecsRequestDTO specReq) {
        if (specReq == null) return null;
        CpuInfor cpu = specReq.getCpuId() != null ? cpuRepo.findById(specReq.getCpuId()).orElse(null) : null;
        RamInfor ram = specReq.getRamId() != null ? ramRepo.findById(specReq.getRamId()).orElse(null) : null;
        StorageInfor storage = specReq.getStorageId() != null ? storageRepo.findById(specReq.getStorageId()).orElse(null) : null;
        GpuInfor gpu = specReq.getGpuId() != null ? gpuRepo.findById(specReq.getGpuId()).orElse(null) : null;
        ScreenInfor screen = specReq.getScreenId() != null ? screenRepo.findById(specReq.getScreenId()).orElse(null) : null;

        ProductsSpecs specs = ProductsSpecs.builder()
                .cpu(cpu).ram(ram).storage(storage).gpu(gpu).screen(screen)
                .battery(specReq.getBattery()).weight(specReq.getWeight()).os(specReq.getOs())
                .build();
        return productsSpecsRepository.save(specs);
    }

    private ProductDTO convertToDTO(Product product) {
        List<ProductDetail> detailsList = productDetailRepository.findByProductId(product.getId());
        List<ProductDetailDTO> detailDTOs = new ArrayList<>();
        
        for (ProductDetail pd : detailsList) {
            ProductSpecsDTO specsDTO = null;
            if (pd.getProductsSpecs() != null) {
                ProductsSpecs ps = pd.getProductsSpecs();
                specsDTO = ProductSpecsDTO.builder()
                        .id(ps.getId())
                        .cpu(mapCpu(ps.getCpu()))
                        .ram(mapRam(ps.getRam()))
                        .storage(mapStorage(ps.getStorage()))
                        .gpu(mapGpu(ps.getGpu()))
                        .screen(mapScreen(ps.getScreen()))
                        .battery(ps.getBattery())
                        .weight(ps.getWeight())
                        .os(ps.getOs())
                        .build();
            }
            
            detailDTOs.add(ProductDetailDTO.builder()
                    .id(pd.getId())
                    .quantity(pd.getQuantity())
                    .price(pd.getPrice())
                    .color(pd.getColor())
                    .imageDetail(pd.getImageDetail())
                    .specs(specsDTO)
                    .build());
        }

        return ProductDTO.builder()
                .id(product.getId())
                .productName(product.getProductName())
                .productDescription(product.getProductDescription())
                .createDate(product.getCreateDate())
                .categoryName(product.getCategory() != null ? product.getCategory().getCategoryName() : null)
                .details(detailDTOs)
                .build();
    }
    
    private CpuInforDTO mapCpu(CpuInfor cpu) {
        if(cpu == null) return null;
        CpuInforDTO dto = new CpuInforDTO();
        dto.setId(cpu.getId()); dto.setBrands(cpu.getBrands()); dto.setSpeed(cpu.getSpeed());
        dto.setModel(cpu.getModel()); dto.setCores(cpu.getCores()); dto.setThreads(cpu.getThreads());
        dto.setBaseClock(cpu.getBaseClock()); dto.setBoostClock(cpu.getBoostClock()); dto.setCache(cpu.getCache());
        return dto;
    }
    private RamInforDTO mapRam(RamInfor ram) {
        if(ram == null) return null;
        RamInforDTO dto = new RamInforDTO();
        dto.setId(ram.getId()); dto.setSize(ram.getSize()); dto.setType(ram.getType());
        dto.setBus(ram.getBus()); dto.setSlots(ram.getSlots());
        return dto;
    }
    private StorageInforDTO mapStorage(StorageInfor s) {
        if(s == null) return null;
        StorageInforDTO dto = new StorageInforDTO();
        dto.setId(s.getId()); dto.setType(s.getType()); dto.setCapacity(s.getCapacity()); dto.setInterfaceName(s.getInterfaceName());
        return dto;
    }
    private GpuInforDTO mapGpu(GpuInfor g) {
        if(g == null) return null;
        GpuInforDTO dto = new GpuInforDTO();
        dto.setId(g.getId()); dto.setBrand(g.getBrand()); dto.setModel(g.getModel()); dto.setVRam(g.getVRam());
        return dto;
    }
    private ScreenInforDTO mapScreen(ScreenInfor s) {
        if(s == null) return null;
        ScreenInforDTO dto = new ScreenInforDTO();
        dto.setId(s.getId()); dto.setSize(s.getSize()); dto.setResolution(s.getResolution()); 
        dto.setPanel(s.getPanel()); dto.setRefreshRate(s.getRefreshRate()); dto.setBrightness(s.getBrightness());
        return dto;
    }
}
