package com.myprojects.YatrikApp.repository;

import com.myprojects.YatrikApp.entity.Booking;
import com.myprojects.YatrikApp.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    Optional<Booking> findByPaymentSessionId(String sessionId);

    List<Booking> findByUserOrderByCreatedAtDesc(User user);
}
