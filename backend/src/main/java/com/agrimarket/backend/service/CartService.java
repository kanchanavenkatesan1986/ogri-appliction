package com.agrimarket.backend.service;

import com.agrimarket.backend.dto.CartItemRequest;
import com.agrimarket.backend.entity.CartItem;
import com.agrimarket.backend.entity.Product;
import com.agrimarket.backend.entity.User;
import com.agrimarket.backend.repository.CartItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartItemRepository cartItemRepository;
    private final ProductService productService;

    public List<CartItem> getCartByUser(User user) {
        return cartItemRepository.findByUser(user);
    }

    @Transactional
    public CartItem addToCart(User user, CartItemRequest request) {
        Product product = productService.getProductById(request.getProductId());
        
        // Validate stock
        if (product.getStockQuantity() < request.getQuantity()) {
            throw new RuntimeException("Insufficient stock. Only " + product.getStockQuantity() + " items available.");
        }

        // Check if item already exists in user's cart
        CartItem cartItem = cartItemRepository.findByUserAndProduct(user, product)
                .map(item -> {
                    int newQty = item.getQuantity() + request.getQuantity();
                    if (product.getStockQuantity() < newQty) {
                        throw new RuntimeException("Cannot add more. Limit exceeded by stock.");
                    }
                    item.setQuantity(newQty);
                    return item;
                })
                .orElseGet(() -> CartItem.builder()
                        .user(user)
                        .product(product)
                        .quantity(request.getQuantity())
                        .build());

        return cartItemRepository.save(cartItem);
    }

    @Transactional
    public CartItem updateCartItemQuantity(User user, Long itemId, Integer quantity) {
        CartItem cartItem = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        if (!cartItem.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized modification of cart item");
        }

        Product product = cartItem.getProduct();
        if (product.getStockQuantity() < quantity) {
            throw new RuntimeException("Insufficient stock. Only " + product.getStockQuantity() + " items available.");
        }

        cartItem.setQuantity(quantity);
        return cartItemRepository.save(cartItem);
    }

    @Transactional
    public void removeFromCart(User user, Long itemId) {
        CartItem cartItem = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        if (!cartItem.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized removal of cart item");
        }

        cartItemRepository.delete(cartItem);
    }

    @Transactional
    public void clearCart(User user) {
        cartItemRepository.deleteByUser(user);
    }
}
