package com.myprojects.YatrikApp.service;

import com.myprojects.YatrikApp.entity.Room;

public interface InventoryService {

    void initializeRoomForAYear(Room room);

    void deleteAllInventories(Room room);

}
