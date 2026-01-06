package com.myprojects.YatrikApp.repository;

import com.myprojects.YatrikApp.entity.Guest;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GuestRepository extends JpaRepository<Guest, Long> {
}