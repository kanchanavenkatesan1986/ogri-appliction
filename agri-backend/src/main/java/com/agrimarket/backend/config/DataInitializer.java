package com.agrimarket.backend.config;

import com.agrimarket.backend.entity.Category;
import com.agrimarket.backend.entity.Product;
import com.agrimarket.backend.entity.Role;
import com.agrimarket.backend.entity.User;
import com.agrimarket.backend.repository.CategoryRepository;
import com.agrimarket.backend.repository.ProductRepository;
import com.agrimarket.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import java.math.BigDecimal;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        bootstrapUsers();
        bootstrapCatalog();
    }

    private void bootstrapUsers() {
        if (!userRepository.existsByUsername("admin")) {
            User admin = User.builder()
                    .username("admin")
                    .email("admin@agrimarket.com")
                    .password(passwordEncoder.encode("adminpassword"))
                    .role(Role.ADMIN)
                    .build();
            userRepository.save(admin);
            System.out.println(">>> Created Default Admin Account [admin/adminpassword]");
        }

        if (!userRepository.existsByUsername("user")) {
            User buyer = User.builder()
                    .username("user")
                    .email("user@agrimarket.com")
                    .password(passwordEncoder.encode("userpassword"))
                    .role(Role.USER)
                    .build();
            userRepository.save(buyer);
            System.out.println(">>> Created Default Buyer Account [user/userpassword]");
        }
    }

    private void bootstrapCatalog() {
        if (categoryRepository.count() == 0) {
            // Create Categories
            Category seeds = Category.builder().name("Seeds").description("High yielding hybrid and heirloom agricultural seeds.").build();
            Category fertilizers = Category.builder().name("Fertilizers").description("Chemical and organic fertilizers for maximum growth.").build();
            Category produce = Category.builder().name("Fresh Produce").description("Farm fresh organic vegetables and fruits.").build();
            Category tools = Category.builder().name("Tools & Implements").description("Farming and gardening equipment and hand tools.").build();

            categoryRepository.save(seeds);
            categoryRepository.save(fertilizers);
            categoryRepository.save(produce);
            categoryRepository.save(tools);

            System.out.println(">>> Created Default Product Categories");

            // Create Products under Seeds
            productRepository.save(Product.builder()
                    .name("Premium Wheat Seeds")
                    .description("High-germination disease-resistant wheat seeds suitable for spring/autumn planting.")
                    .price(new BigDecimal("15.00"))
                    .stockQuantity(120)
                    .imageUrl("https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&auto=format&fit=crop&q=80")
                    .category(seeds)
                    .build());

            productRepository.save(Product.builder()
                    .name("Hybrid Tomato Seeds")
                    .description("Heavy-yielding F1 hybrid seeds producing sweet, firm tomatoes. Ideal for gardens and greenhouses.")
                    .price(new BigDecimal("8.50"))
                    .stockQuantity(250)
                    .imageUrl("https://images.unsplash.com/photo-1592841208221-a5808df736a8?w=500&auto=format&fit=crop&q=80")
                    .category(seeds)
                    .build());

            // Create Products under Fertilizers
            productRepository.save(Product.builder()
                    .name("Organic Compost Fertilizer")
                    .description("100% natural organic compost enriched with essential nutrients to revitalize soil structure.")
                    .price(new BigDecimal("22.00"))
                    .stockQuantity(80)
                    .imageUrl("https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=500&auto=format&fit=crop&q=80")
                    .category(fertilizers)
                    .build());

            productRepository.save(Product.builder()
                    .name("NPK Nitrogen Booster")
                    .description("High-performance chemical formula focusing on nitrogen, phosphorus, and potassium ratios for rapid foliage growth.")
                    .price(new BigDecimal("30.00"))
                    .stockQuantity(65)
                    .imageUrl("https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=500&auto=format&fit=crop&q=80")
                    .category(fertilizers)
                    .build());

            // Create Products under Produce
            productRepository.save(Product.builder()
                    .name("Fresh Organic Spinach")
                    .description("Crunchy, nutrient-rich spinach leaves harvested fresh daily, free from pesticides.")
                    .price(new BigDecimal("3.20"))
                    .stockQuantity(40)
                    .imageUrl("https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=500&auto=format&fit=crop&q=80")
                    .category(produce)
                    .build());

            productRepository.save(Product.builder()
                    .name("Red Onions Bunch")
                    .description("Farm-fresh pungent red onions, rich in flavor, loaded directly from harvest bags.")
                    .price(new BigDecimal("4.50"))
                    .stockQuantity(90)
                    .imageUrl("https://images.unsplash.com/photo-1618220179428-22790b461013?w=500&auto=format&fit=crop&q=80")
                    .category(produce)
                    .build());

            // Create Products under Tools
            productRepository.save(Product.builder()
                    .name("Ergonomic Hand Trowel")
                    .description("Sturdy rust-resistant stainless steel hand shovel with a comfortable soft-grip handle for potting.")
                    .price(new BigDecimal("12.99"))
                    .stockQuantity(50)
                    .imageUrl("https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500&auto=format&fit=crop&q=80")
                    .category(tools)
                    .build());

            productRepository.save(Product.builder()
                    .name("Heavy-Duty Garden Shears")
                    .description("Sharp carbon-steel bypass pruning shears, designed to clean-cut stems up to 1-inch thick easily.")
                    .price(new BigDecimal("25.50"))
                    .stockQuantity(35)
                    .imageUrl("https://images.unsplash.com/photo-1622383563227-04401ab4e5ea?w=500&auto=format&fit=crop&q=80")
                    .category(tools)
                    .build());

            System.out.println(">>> Seeded Initial Catalog Products");
        }
    }
}
