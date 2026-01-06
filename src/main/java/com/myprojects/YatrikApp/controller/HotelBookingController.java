package com.myprojects.YatrikApp.controller;

import com.myprojects.YatrikApp.dto.BookingDto;
import com.myprojects.YatrikApp.dto.BookingRequest;
import com.myprojects.YatrikApp.dto.GuestsDto;
import com.myprojects.YatrikApp.service.BookingService;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/bookings")
public class HotelBookingController {

    private final BookingService bookingService;

    @PostMapping("/init")
    public ResponseEntity<BookingDto> initialiseBooking(@RequestBody BookingRequest bookingRequest){
        return ResponseEntity.ok(bookingService.initialiseBooking(bookingRequest));

    }

    @PostMapping("/{bookingId}/addGuests")
    public ResponseEntity<BookingDto> addGuests(@PathVariable Long bookingId, @RequestBody List<GuestsDto> guestsDtoList){
        return ResponseEntity.ok(bookingService.addGuests(bookingId, guestsDtoList));
    }
}
