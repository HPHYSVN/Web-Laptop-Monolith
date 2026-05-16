package com.laptop.laptopstore.services;

import com.laptop.laptopstore.dtos.*;
import com.laptop.laptopstore.models.*;
import com.laptop.laptopstore.repositories.*;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
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
    private final CommentRepository commentRepository;
    private final CartDetailRepository cartDetailRepository;
    private final OrderDetailRepository orderDetailRepository;

    @Transactional(readOnly = true)
    public List<ProductDTO> getAllProducts() {
        return productRepository.findAll().stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PageResponseDTO<ProductDTO> getProductsPage(int page, int size, ProductFilterDTO filterDTO) {
        Pageable pageable = PageRequest.of(page, size, buildSort(filterDTO.getSortBy(), filterDTO.getSortOrder()));
        Page<ProductDTO> productPage = productRepository
                .findAll(ProductSpecification.filterProducts(filterDTO), pageable)
                .map(this::convertToDTO);

        return PageResponseDTO.<ProductDTO>builder()
                .content(productPage.getContent())
                .page(productPage.getNumber())
                .size(productPage.getSize())
                .totalElements(productPage.getTotalElements())
                .totalPages(productPage.getTotalPages())
                .first(productPage.isFirst())
                .last(productPage.isLast())
                .build();
    }

    private Sort buildSort(String sortBy, String sortOrder) {
        Sort.Direction direction = "desc".equalsIgnoreCase(sortOrder) ? Sort.Direction.DESC : Sort.Direction.ASC;
        if ("name".equalsIgnoreCase(sortBy) || "productName".equalsIgnoreCase(sortBy)) {
            return Sort.by(direction, "productName");
        }
        if ("created".equalsIgnoreCase(sortBy) || "createDate".equalsIgnoreCase(sortBy)) {
            return Sort.by(direction, "createDate");
        }
        return Sort.by(Sort.Direction.DESC, "createDate");
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
        List<ProductDTO> products = productRepository.findAll(com.laptop.laptopstore.repositories.ProductSpecification.filterProducts(filterDTO))
                .stream().map(this::convertToDTO).collect(Collectors.toList());

        // Apply sorting
        if (filterDTO.getSortBy() != null) {
            String sortBy = filterDTO.getSortBy().toLowerCase();
            String sortOrder = filterDTO.getSortOrder() != null ? filterDTO.getSortOrder().toLowerCase() : "asc";
            boolean ascending = sortOrder.equals("asc");

            if (sortBy.equals("price")) {
                products.sort((p1, p2) -> {
                    Double price1 = getLowestPrice(p1);
                    Double price2 = getLowestPrice(p2);
                    return ascending ? price1.compareTo(price2) : price2.compareTo(price1);
                });
            } else if (sortBy.equals("discount")) {
                // For now, sort by price (discount logic to be implemented when discounts are integrated)
                products.sort((p1, p2) -> {
                    Double price1 = getLowestPrice(p1);
                    Double price2 = getLowestPrice(p2);
                    return ascending ? price1.compareTo(price2) : price2.compareTo(price1);
                });
            }
        }

        return products;
    }

    private Double getLowestPrice(ProductDTO product) {
        if (product.getDetails() == null || product.getDetails().isEmpty()) {
            return Double.MAX_VALUE;
        }
        return product.getDetails().stream()
                .map(ProductDetailDTO::getPrice)
                .min(Double::compare)
                .orElse(Double.MAX_VALUE);
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
        // Delete comments referencing this product
        List<Comment> comments = commentRepository.findByProductId(id);
        for (Comment comment : comments) {
            commentRepository.delete(comment);
        }

        // Delete product details and related records
        List<ProductDetail> details = productDetailRepository.findByProductId(id);
        for (ProductDetail detail : details) {
            // Delete cart details referencing this product detail
            cartDetailRepository.deleteByProductDetailId(detail.getId());
            // Delete order details referencing this product detail
            orderDetailRepository.deleteByProductDetailId(detail.getId());
            // Delete specs
            if (detail.getProductsSpecs() != null) {
                productsSpecsRepository.delete(detail.getProductsSpecs());
            }
            // Delete product detail
            productDetailRepository.delete(detail);
        }
        // Finally delete the product
        productRepository.deleteById(id);
    }

    @Transactional
    public void deleteProducts(List<Long> ids) {
        for (Long id : ids) {
            if (productRepository.existsById(id)) {
                deleteProduct(id);
            }
        }
    }

    @Transactional
    public int importProducts(MultipartFile file) {
        String filename = file.getOriginalFilename() != null ? file.getOriginalFilename().toLowerCase() : "";
        try {
            List<ProductRequestDTO> requests = filename.endsWith(".xlsx")
                    ? readProductsFromXlsx(file)
                    : readProductsFromCsv(file);
            for (ProductRequestDTO request : requests) {
                createProduct(request);
            }
            return requests.size();
        } catch (Exception e) {
            throw new RuntimeException("Không thể import file: " + e.getMessage());
        }
    }

    @Transactional(readOnly = true)
    public byte[] exportProducts(String format) {
        List<ProductDTO> products = getAllProducts();
        try {
            if ("xlsx".equalsIgnoreCase(format)) {
                return exportProductsXlsx(products);
            }
            return exportProductsCsv(products);
        } catch (Exception e) {
            throw new RuntimeException("Không thể export file: " + e.getMessage());
        }
    }

    private List<ProductRequestDTO> readProductsFromCsv(MultipartFile file) throws Exception {
        List<ProductRequestDTO> requests = new ArrayList<>();
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))) {
            String line;
            boolean first = true;
            while ((line = reader.readLine()) != null) {
                if (first) {
                    first = false;
                    if (line.toLowerCase().contains("productname")) continue;
                }
                if (line.trim().isEmpty()) continue;
                requests.add(toImportRequest(line.split(",", -1)));
            }
        }
        return requests;
    }

    private List<ProductRequestDTO> readProductsFromXlsx(MultipartFile file) throws Exception {
        List<ProductRequestDTO> requests = new ArrayList<>();
        try (Workbook workbook = WorkbookFactory.create(file.getInputStream())) {
            Sheet sheet = workbook.getSheetAt(0);
            for (int i = 1; i <= sheet.getLastRowNum(); i++) {
                Row row = sheet.getRow(i);
                if (row == null) continue;
                String[] values = new String[7];
                for (int c = 0; c < values.length; c++) {
                    values[c] = readCell(row.getCell(c));
                }
                if (values[0] == null || values[0].isBlank()) continue;
                requests.add(toImportRequest(values));
            }
        }
        return requests;
    }

    private ProductRequestDTO toImportRequest(String[] values) {
        ProductRequestDTO request = new ProductRequestDTO();
        request.setProductName(valueAt(values, 0));
        request.setProductDescription(valueAt(values, 1));
        request.setCategoryId(parseLong(valueAt(values, 2)));

        ProductDetailRequestDTO detail = new ProductDetailRequestDTO();
        detail.setPrice(parseDouble(valueAt(values, 3), 0.0));
        detail.setQuantity(parseInt(valueAt(values, 4), 0));
        detail.setColor(valueAt(values, 5));
        detail.setImageDetail(valueAt(values, 6));
        request.setDetails(List.of(detail));
        return request;
    }

    private byte[] exportProductsCsv(List<ProductDTO> products) {
        StringBuilder csv = new StringBuilder("productName,description,categoryName,price,quantity,color,image\n");
        for (ProductDTO product : products) {
            ProductDetailDTO detail = firstDetail(product);
            csv.append(escapeCsv(product.getProductName())).append(',')
                    .append(escapeCsv(product.getProductDescription())).append(',')
                    .append(escapeCsv(product.getCategoryName())).append(',')
                    .append(detail != null ? detail.getPrice() : "").append(',')
                    .append(detail != null ? detail.getQuantity() : "").append(',')
                    .append(escapeCsv(detail != null ? detail.getColor() : "")).append(',')
                    .append(escapeCsv(detail != null ? detail.getImageDetail() : "")).append('\n');
        }
        return csv.toString().getBytes(StandardCharsets.UTF_8);
    }

    private byte[] exportProductsXlsx(List<ProductDTO> products) throws Exception {
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Products");
            String[] headers = {"productName", "description", "categoryName", "price", "quantity", "color", "image"};
            Row header = sheet.createRow(0);
            for (int i = 0; i < headers.length; i++) header.createCell(i).setCellValue(headers[i]);

            int rowIndex = 1;
            for (ProductDTO product : products) {
                ProductDetailDTO detail = firstDetail(product);
                Row row = sheet.createRow(rowIndex++);
                row.createCell(0).setCellValue(product.getProductName());
                row.createCell(1).setCellValue(product.getProductDescription() != null ? product.getProductDescription() : "");
                row.createCell(2).setCellValue(product.getCategoryName() != null ? product.getCategoryName() : "");
                row.createCell(3).setCellValue(detail != null ? detail.getPrice() : 0);
                row.createCell(4).setCellValue(detail != null ? detail.getQuantity() : 0);
                row.createCell(5).setCellValue(detail != null && detail.getColor() != null ? detail.getColor() : "");
                row.createCell(6).setCellValue(detail != null && detail.getImageDetail() != null ? detail.getImageDetail() : "");
            }
            workbook.write(out);
            return out.toByteArray();
        }
    }

    private ProductDetailDTO firstDetail(ProductDTO product) {
        return product.getDetails() != null && !product.getDetails().isEmpty() ? product.getDetails().get(0) : null;
    }

    private String valueAt(String[] values, int index) {
        return index < values.length ? values[index].trim() : "";
    }

    private Long parseLong(String value) {
        if (value == null || value.isBlank()) return null;
        return Long.parseLong(value.replace(".0", ""));
    }

    private Integer parseInt(String value, int fallback) {
        if (value == null || value.isBlank()) return fallback;
        return (int) Double.parseDouble(value);
    }

    private Double parseDouble(String value, double fallback) {
        if (value == null || value.isBlank()) return fallback;
        return Double.parseDouble(value);
    }

    private String readCell(Cell cell) {
        if (cell == null) return "";
        cell.setCellType(CellType.STRING);
        return cell.getStringCellValue().trim();
    }

    private String escapeCsv(String value) {
        if (value == null) return "";
        String escaped = value.replace("\"", "\"\"");
        return escaped.contains(",") || escaped.contains("\"") || escaped.contains("\n") ? "\"" + escaped + "\"" : escaped;
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
