package com.myprojects.YatrikApp.service;

import com.myprojects.YatrikApp.dto.HotelDto;
import com.myprojects.YatrikApp.dto.HotelInfoDto;

import java.util.List;

public interface HotelService {
    HotelDto createNewHotel(HotelDto hotelDto);

    List<HotelDto> getAllHotels();

    HotelDto getHotelById(Long id);

    HotelDto updateHotelById(Long id, HotelDto hotelDto);

    void deleteHotelById(Long id);

    void activeHotel(Long hotelId);

    HotelInfoDto getHotelInfoById(Long hotelId);
}
