package com.myprojects.YatrikApp.repository;

import com.myprojects.YatrikApp.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookingRepository extends JpaRepository<Booking, Long> {
}
