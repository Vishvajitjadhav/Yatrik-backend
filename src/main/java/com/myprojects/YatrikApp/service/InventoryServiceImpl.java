package com.myprojects.YatrikApp.service;

import com.myprojects.YatrikApp.dto.HotelDto;
import com.myprojects.YatrikApp.dto.HotelSearchDto;
import com.myprojects.YatrikApp.entity.Hotel;
import com.myprojects.YatrikApp.entity.Inventory;
import com.myprojects.YatrikApp.entity.Room;
import com.myprojects.YatrikApp.repository.InventoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

@Service
@RequiredArgsConstructor
@Slf4j
public class InventoryServiceImpl implements InventoryService{
    private final ModelMapper modelMapper;

    private final InventoryRepository inventoryRepository;

    @Override
    public void initializeRoomForAYear(Room room) {
        LocalDate today = LocalDate.now();
        LocalDate endDate = today.plusYears(1);
        for(; !today.isAfter(endDate); today=today.plusDays(1)){
            Inventory inventory = Inventory.builder()
                    .hotel(room.getHotel())
                    .room(room)
                    .bookedCount(0)
                    .reservedCount(0)
                    .city(room.getHotel().getCity())
                    .date(today)
                    .price(room.getBasePrice())
                    .surgefactor(BigDecimal.ONE)
                    .totalCount(room.getTotalCount())
                    .closed(false)
                    .build();
            inventoryRepository.save(inventory);
        }


    }

    @Override
    public void deleteAllInventories(Room room) {
        log.info("Deleting the inventories of room with id: {}", room.getId());
        inventoryRepository.deleteByRoom(room);
    }

    //Search function pagination
    @Override
    public Page<HotelDto> searchHotels(HotelSearchDto hotelSearchDto) {
        log.info("Searching hotels for {} city, from {} to {}", hotelSearchDto.getCity(), hotelSearchDto.getStartDate(), hotelSearchDto.getEndDate());
        Pageable pageable = PageRequest.of(hotelSearchDto.getPage(), hotelSearchDto.getSize());
        long dateCount = ChronoUnit.DAYS.between(hotelSearchDto.getStartDate(), hotelSearchDto.getEndDate()) + 1;

        Page<Hotel> hotelPage = inventoryRepository.findHotelsWithAvailableInventory(hotelSearchDto.getCity(),
                hotelSearchDto.getStartDate(), hotelSearchDto.getEndDate(), hotelSearchDto.getRoomsCount(),
                dateCount, pageable );

        return hotelPage.map((element) -> modelMapper.map(element, HotelDto.class));
    }
}
