package com.myprojects.YatrikApp.repository;

import com.myprojects.YatrikApp.entity.Inventory;
import com.myprojects.YatrikApp.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;



public interface InventoryRepository extends JpaRepository<Inventory, Long> {

    void deleteByRoom(Room room);

}