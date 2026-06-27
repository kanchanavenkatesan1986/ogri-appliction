package com.agrimarket.backend.controller;

import com.agrimarket.backend.dto.OrderRequest;
import com.agrimarket.backend.entity.Order;
import com.agrimarket.backend.entity.OrderStatus;
import com.agrimarket.backend.entity.User;
import com.agrimarket.backend.service.AuthService;
import com.agrimarket.backend.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import java.util.List;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;
    private final AuthService authService;

    private User getAuthenticatedUser(Principal principal) {
        return authService.getUserByUsername(principal.getName());
    }

    @PostMapping("/place")
    public ResponseEntity<Order> placeOrder(Principal principal, @Valid @RequestBody OrderRequest request) {
        User user = getAuthenticatedUser(principal);
        Order order = orderService.placeOrder(user, request);
        return new ResponseEntity<>(order, HttpStatus.CREATED);
    }

    @GetMapping("/my-orders")
    public ResponseEntity<List<Order>> getMyOrders(Principal principal) {
        User user = getAuthenticatedUser(principal);
        return ResponseEntity.ok(orderService.getMyOrders(user));
    }

    @GetMapping("/all")
    public ResponseEntity<List<Order>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Order> updateOrderStatus(
            @PathVariable Long id,
            @RequestParam OrderStatus status
    ) {
        Order updatedOrder = orderService.updateOrderStatus(id, status);
        return ResponseEntity.ok(updatedOrder);
    }
}
