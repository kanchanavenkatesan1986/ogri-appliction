package com.agrimarket.backend.service;

import com.agrimarket.backend.dto.OrderRequest;
import com.agrimarket.backend.entity.*;
import com.agrimarket.backend.repository.OrderRepository;
import com.agrimarket.backend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final CartService cartService;

    @Transactional
    public Order placeOrder(User user, OrderRequest request) {
        List<CartItem> cartItems = cartService.getCartByUser(user);
        
        if (cartItems.isEmpty()) {
            throw new RuntimeException("Cannot place order. Your shopping cart is empty.");
        }

        BigDecimal totalAmount = BigDecimal.ZERO;
        List<OrderItem> orderItems = new ArrayList<>();
        
        Order order = Order.builder()
                .user(user)
                .orderDate(LocalDateTime.now())
                .status(OrderStatus.PENDING)
                .shippingAddress(request.getShippingAddress())
                .contactNumber(request.getContactNumber())
                .totalAmount(BigDecimal.ZERO) // Temporary placeholder
                .build();

        for (CartItem cartItem : cartItems) {
            Product product = cartItem.getProduct();
            
            // Re-verify stock
            if (product.getStockQuantity() < cartItem.getQuantity()) {
                throw new RuntimeException("Insufficient stock for product: " + product.getName() 
                        + ". Available: " + product.getStockQuantity());
            }

            // Deduct stock
            product.setStockQuantity(product.getStockQuantity() - cartItem.getQuantity());
            productRepository.save(product);

            // Calculate item price
            BigDecimal itemTotal = product.getPrice().multiply(new BigDecimal(cartItem.getQuantity()));
            totalAmount = totalAmount.add(itemTotal);

            // Create OrderItem
            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .product(product)
                    .quantity(cartItem.getQuantity())
                    .price(product.getPrice()) // unit price
                    .build();
                    
            orderItems.add(orderItem);
        }

        order.setTotalAmount(totalAmount);
        order.setOrderItems(orderItems);

        // Save order (cascade creates order items)
        Order savedOrder = orderRepository.save(order);

        // Clear the user's cart
        cartService.clearCart(user);

        return savedOrder;
    }

    public List<Order> getMyOrders(User user) {
        return orderRepository.findByUserOrderByOrderDateDesc(user);
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAllByOrderByOrderDateDesc();
    }

    @Transactional
    public Order updateOrderStatus(Long orderId, OrderStatus newStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with ID: " + orderId));

        OrderStatus currentStatus = order.getStatus();
        
        // If order transitions to CANCELLED and was not already cancelled, refund the stock
        if (newStatus == OrderStatus.CANCELLED && currentStatus != OrderStatus.CANCELLED) {
            for (OrderItem item : order.getOrderItems()) {
                if (item.getProduct() != null) {
                    Product product = item.getProduct();
                    product.setStockQuantity(product.getStockQuantity() + item.getQuantity());
                    productRepository.save(product);
                }
            }
        }
        
        // If order transitions OUT of CANCELLED back to PENDING/SHIPPED/DELIVERED, re-deduct the stock (advanced case)
        if (currentStatus == OrderStatus.CANCELLED && newStatus != OrderStatus.CANCELLED) {
            for (OrderItem item : order.getOrderItems()) {
                if (item.getProduct() != null) {
                    Product product = item.getProduct();
                    if (product.getStockQuantity() < item.getQuantity()) {
                        throw new RuntimeException("Cannot restore order. Insufficient stock for product: " 
                                + product.getName());
                    }
                    product.setStockQuantity(product.getStockQuantity() - item.getQuantity());
                    productRepository.save(product);
                }
            }
        }

        order.setStatus(newStatus);
        return orderRepository.save(order);
    }
}
