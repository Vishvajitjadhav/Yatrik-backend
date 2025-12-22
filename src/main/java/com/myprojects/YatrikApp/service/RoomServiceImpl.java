package com.myprojects.YatrikApp.service;

import com.myprojects.YatrikApp.dto.RoomDto;
import com.myprojects.YatrikApp.entity.Hotel;
import com.myprojects.YatrikApp.entity.Room;
import com.myprojects.YatrikApp.exception.ResourceNotFoundException;
import com.myprojects.YatrikApp.repository.HotelRepository;
import com.myprojects.YatrikApp.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class RoomServiceImpl implements RoomService{

    private final RoomRepository roomRepository;
    private final HotelRepository hotelRepository;
    private final InventoryService inventoryService;
    private final ModelMapper modelMapper;

    @Override
    public RoomDto createNewRoom(Long hotelId, RoomDto roomDto) {
        log.info("Creating a new room with ID : {}", hotelId);
        Hotel hotel = hotelRepository
                .findById(hotelId)
                .orElseThrow(() -> new ResourceNotFoundException("Hotel not found eith Id : " + hotelId));
        Room room = modelMapper.map(roomDto, Room.class);
        room.setHotel(hotel);
        room = roomRepository.save(room);

        //DONE:create inventory as soon as hotel created and if hotel is active - Done
        if(hotel.getActive()){
            inventoryService.initializeRoomForAYear(room);

        }

        return modelMapper.map(room, RoomDto.class);

    }

    @Override
    public List<RoomDto> getAllRoomInHotel(Long hotelId) { //Can use onetomany mapping in hotel
        log.info("Getting all rooms in hotel with ID : {}", hotelId);
        Hotel hotel = hotelRepository
                .findById(hotelId)
                .orElseThrow(() -> new ResourceNotFoundException("Hotel not found eith Id : " + hotelId));
        return hotel.getRooms()
                .stream()
                .map((element) -> modelMapper.map(element, RoomDto.class))
                .collect(Collectors.toList());
    }

    @Override
    public RoomDto getRoomById(Long roomId) {
        log.info("Getting the room with Id : {}", roomId);
        Room room = roomRepository
                .findById(roomId)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found eith Id : " + roomId));
        return modelMapper.map(room, RoomDto.class);
    }

    @Override
    @Transactional
    public void deleteRoomById(Long roomId) {
        log.info("Deleting room by ID : {}",roomId );
        Room room = roomRepository
                .findById(roomId)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found eith Id : " + roomId));

        //DONE: delete all future inventory for this room
        inventoryService.deleteAllInventories(room);
        roomRepository.deleteById(roomId);

    }
}
