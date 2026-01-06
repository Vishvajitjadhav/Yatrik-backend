package com.myprojects.YatrikApp.controller;

import com.myprojects.YatrikApp.dto.HotelDto;
import com.myprojects.YatrikApp.dto.HotelInfoDto;
import com.myprojects.YatrikApp.dto.HotelPriceDto;
import com.myprojects.YatrikApp.dto.HotelSearchDto;
import com.myprojects.YatrikApp.repository.InventoryRepository;
import com.myprojects.YatrikApp.service.HotelService;
import com.myprojects.YatrikApp.service.InventoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/hotels")
@RequiredArgsConstructor
public class HotelBrowserController {

    private final InventoryService inventoryService;
    private final HotelService hotelService;

    //Search function pagination
    @GetMapping("/search")
    public ResponseEntity<Page<HotelPriceDto>> searchHotels(@RequestBody HotelSearchDto hotelSearchDto){

        var page = inventoryService.searchHotels(hotelSearchDto);
        return ResponseEntity.ok(page);

    }

    @GetMapping("/{hotelId}/info")
    public ResponseEntity<HotelInfoDto> grtHotelInfo(@PathVariable Long hotelId){
        return ResponseEntity.ok(hotelService.getHotelInfoById(hotelId));
    }


}
