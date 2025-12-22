package com.myprojects.YatrikApp.service;

import com.myprojects.YatrikApp.dto.HotelDto;
import com.myprojects.YatrikApp.entity.Hotel;

public interface HotelService {
    HotelDto createNewHotel(HotelDto hotelDto);

    HotelDto getHotelById(Long id);

    HotelDto updateHotelById(Long id, HotelDto hotelDto);

    void deleteHotelById(Long id);

    void activeHotel(Long hotelId);

}
