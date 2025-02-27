package com.example.ecommerce_app.service.impl;

import com.example.ecommerce_app.dto.ShippingDetailsDto;
import com.example.ecommerce_app.dto.response.OrderPageResponse;
import com.example.ecommerce_app.dto.response.OrderResponse;
import com.example.ecommerce_app.entity.Order;
import com.example.ecommerce_app.repository.OrderRepository;
import com.example.ecommerce_app.service.OrderService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;


@Service
@Transactional
public class OrderServiceImpl implements OrderService {

    private OrderRepository orderRepository;
    public OrderServiceImpl(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    public Order save(Order order) {
        return orderRepository.save(order);
    }

    public OrderPageResponse getAllOrders(Long userId,int page, int size) {
        Pageable pageable = PageRequest.of(page, size,Sort.by(Sort.Direction.DESC, "id"));
        Page<Order> orders = orderRepository.findByUserId(userId,pageable);
        List<Order> orderList = orders.getContent();

        OrderPageResponse orderPageResponse = new OrderPageResponse();
        List<OrderResponse> content = new ArrayList<>();

        for (Order order : orderList) {
            OrderResponse orderResponse = new OrderResponse();

            orderResponse.setOrderId(order.getId());
            orderResponse.setTotalPrice(order.getTotalPrice());
            orderResponse.setQuantity(order.getQuantity());
            orderResponse.setShippingName(order.getShippingName());
            orderResponse.setShippingAddress(order.getShippingAddress());
            orderResponse.setShippingCountry(order.getShippingCountry());
            orderResponse.setShippingEmail(order.getShippingEmail());
            orderResponse.setStatus(order.getOrderStatus());
            orderResponse.setContactNumber(order.getShippingContact());

            orderResponse.setProductName(order.getProduct().getTitle());
            orderResponse.setProductCategory(order.getProduct().getCategory());
            orderResponse.setProductImg(order.getProduct().getImage());

            orderResponse.setSize(order.getVariant().getSize());
            orderResponse.setColor(order.getVariant().getColor());

            content.add(orderResponse);
        }

        orderPageResponse.setOrders(content);
        orderPageResponse.setTotalPages(orders.getTotalPages());
        orderPageResponse.setTotalElements(orders.getTotalElements());
        orderPageResponse.setPageNo(orders.getNumber());
        orderPageResponse.setPageSize(orders.getSize());
        orderPageResponse.setLast(orders.isLast());

        return orderPageResponse;
    }

    public OrderResponse getOrder(Long orderId) {
        Order order = orderRepository.findById(orderId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                "Cart not found order: "));

        OrderResponse orderResponse = new OrderResponse();

        orderResponse.setOrderId(order.getId());
        orderResponse.setTotalPrice(order.getTotalPrice());
        orderResponse.setQuantity(order.getQuantity());
        orderResponse.setShippingName(order.getShippingName());
        orderResponse.setShippingAddress(order.getShippingAddress());
        orderResponse.setShippingCountry(order.getShippingCountry());
        orderResponse.setShippingEmail(order.getShippingEmail());
        orderResponse.setStatus(order.getOrderStatus());
        orderResponse.setContactNumber(order.getShippingContact());

        orderResponse.setProductName(order.getProduct().getTitle());
        orderResponse.setProductCategory(order.getProduct().getCategory());
        orderResponse.setProductImg(order.getProduct().getImage());

        orderResponse.setSize(order.getVariant().getSize());
        orderResponse.setColor(order.getVariant().getColor());

        return orderResponse ;
    }

    public String setShippingDetails(Long orderId, ShippingDetailsDto shippingDetailsDto) {
        Order order = orderRepository.findById(orderId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                "Not found order: "));

        order.setShippingAddress(shippingDetailsDto.getHomeAddress());
        order.setShippingEmail(shippingDetailsDto.getEmail());
        order.setShippingContact(shippingDetailsDto.getContactNumber());
        order.setShippingName(shippingDetailsDto.getName());
        order.setShippingEmail(shippingDetailsDto.getEmail());
        order.setShippingCountry(shippingDetailsDto.getCountry());

        orderRepository.save(order);

        return "Saved shipping details successfully" ;
    }

    public Long totalOrders(Long userId) {
        return orderRepository.countByUserId(userId) ;
    }
}
