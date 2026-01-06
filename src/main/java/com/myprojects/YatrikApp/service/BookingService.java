package com.myprojects.YatrikApp.service;

import com.myprojects.YatrikApp.dto.BookingDto;
import com.myprojects.YatrikApp.dto.BookingRequest;
import com.myprojects.YatrikApp.dto.GuestsDto;
import org.jspecify.annotations.Nullable;

import java.util.List;

public interface BookingService {
    BookingDto initialiseBooking(BookingRequest bookingRequest);

    BookingDto addGuests(Long bookingId, List<GuestsDto> guestsDtoList);
}
