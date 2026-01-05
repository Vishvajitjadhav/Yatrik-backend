package com.myprojects.YatrikApp.service;

import com.myprojects.YatrikApp.dto.HotelDto;
import com.myprojects.YatrikApp.dto.HotelSearchDto;
import com.myprojects.YatrikApp.entity.Room;
import org.springframework.data.domain.Page;

public interface InventoryService {

    void initializeRoomForAYear(Room room);

    void deleteAllInventories(Room room);

    Page<HotelDto> searchHotels(HotelSearchDto hotelSearchDto);
}
