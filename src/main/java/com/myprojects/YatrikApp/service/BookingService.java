package com.myprojects.YatrikApp.service;

import com.myprojects.YatrikApp.dto.BookingDto;
import com.myprojects.YatrikApp.dto.BookingRequest;
import com.myprojects.YatrikApp.dto.GuestsDto;
import com.myprojects.YatrikApp.entity.enums.BookingStatus;
import com.stripe.model.Event;
import org.jspecify.annotations.Nullable;

import java.util.List;

public interface BookingService {
    BookingDto initialiseBooking(BookingRequest bookingRequest);

    BookingDto addGuests(Long bookingId, List<GuestsDto> guestsDtoList);

    String initiatePayments(Long bookingId);


    void capturePayment(Event event);

    void cancelBooking(Long bookingId);

    BookingStatus getBookingStatus(Long bookingId);

    List<BookingDto> getMyBookings();
}
