package com.agrimarket.backend.controller;

import com.agrimarket.backend.dto.CartItemRequest;
import com.agrimarket.backend.entity.CartItem;
import com.agrimarket.backend.entity.User;
import com.agrimarket.backend.service.AuthService;
import com.agrimarket.backend.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;
    private final AuthService authService;

    private User getAuthenticatedUser(Principal principal) {
        return authService.getUserByUsername(principal.getName());
    }

    @GetMapping
    public ResponseEntity<List<CartItem>> getCart(Principal principal) {
        User user = getAuthenticatedUser(principal);
        return ResponseEntity.ok(cartService.getCartByUser(user));
    }

    @PostMapping("/add")
    public ResponseEntity<CartItem> addToCart(Principal principal, @Valid @RequestBody CartItemRequest request) {
        User user = getAuthenticatedUser(principal);
        CartItem cartItem = cartService.addToCart(user, request);
        return ResponseEntity.ok(cartItem);
    }

    @PutMapping("/update/{itemId}")
    public ResponseEntity<CartItem> updateCartItem(
            Principal principal,
            @PathVariable Long itemId,
            @RequestParam Integer quantity
    ) {
        User user = getAuthenticatedUser(principal);
        CartItem cartItem = cartService.updateCartItemQuantity(user, itemId, quantity);
        return ResponseEntity.ok(cartItem);
    }

    @DeleteMapping("/remove/{itemId}")
    public ResponseEntity<Void> removeFromCart(Principal principal, @PathVariable Long itemId) {
        User user = getAuthenticatedUser(principal);
        cartService.removeFromCart(user, itemId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/clear")
    public ResponseEntity<Void> clearCart(Principal principal) {
        User user = getAuthenticatedUser(principal);
        cartService.clearCart(user);
        return ResponseEntity.noContent().build();
    }
}
