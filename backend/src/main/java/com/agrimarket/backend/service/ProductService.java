package com.agrimarket.backend.service;

import com.agrimarket.backend.dto.ProductDTO;
import com.agrimarket.backend.entity.Category;
import com.agrimarket.backend.entity.Product;
import com.agrimarket.backend.repository.CategoryRepository;
import com.agrimarket.backend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    // Categories Service Actions
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    public Category getCategoryById(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found with ID: " + id));
    }

    @Transactional
    public Category createCategory(Category category) {
        if (categoryRepository.existsByName(category.getName())) {
            throw new RuntimeException("Category name '" + category.getName() + "' already exists");
        }
        return categoryRepository.save(category);
    }

    @Transactional
    public void deleteCategory(Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new RuntimeException("Category not found with ID: " + id);
        }
        categoryRepository.deleteById(id);
    }

    // Products Service Actions
    public List<Product> getAllProducts(String search, Long categoryId) {
        if (categoryId != null && search != null && !search.trim().isEmpty()) {
            return productRepository.findByCategoryIdAndNameContainingIgnoreCase(categoryId, search.trim());
        } else if (categoryId != null) {
            return productRepository.findByCategoryId(categoryId);
        } else if (search != null && !search.trim().isEmpty()) {
            return productRepository.findByNameContainingIgnoreCase(search.trim());
        } else {
            return productRepository.findAll();
        }
    }

    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with ID: " + id));
    }

    @Transactional
    public Product createProduct(ProductDTO dto) {
        Category category = getCategoryById(dto.getCategoryId());
        
        Product product = Product.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .price(dto.getPrice())
                .imageUrl(dto.getImageUrl())
                .stockQuantity(dto.getStockQuantity())
                .category(category)
                .build();
                
        return productRepository.save(product);
    }

    @Transactional
    public Product updateProduct(Long id, ProductDTO dto) {
        Product existingProduct = getProductById(id);
        Category category = getCategoryById(dto.getCategoryId());
        
        existingProduct.setName(dto.getName());
        existingProduct.setDescription(dto.getDescription());
        existingProduct.setPrice(dto.getPrice());
        existingProduct.setImageUrl(dto.getImageUrl());
        existingProduct.setStockQuantity(dto.getStockQuantity());
        existingProduct.setCategory(category);
        
        return productRepository.save(existingProduct);
    }

    @Transactional
    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new RuntimeException("Product not found with ID: " + id);
        }
        productRepository.deleteById(id);
    }
}
