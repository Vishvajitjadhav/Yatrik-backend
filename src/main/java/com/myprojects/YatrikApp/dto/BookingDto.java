package com.myprojects.YatrikApp.dto;

import com.myprojects.YatrikApp.entity.Guest;
import com.myprojects.YatrikApp.entity.Hotel;
import com.myprojects.YatrikApp.entity.Room;
import com.myprojects.YatrikApp.entity.User;
import com.myprojects.YatrikApp.entity.enums.BookingStatus;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;
@Data
public class BookingDto {
    private long id;
    private Integer roomsCount;
    private LocalDate CheckInDate;
    private LocalDate CheckOutDate;
    private LocalDateTime createdAt;
    private LocalDateTime updateAt;
    private BookingStatus bookingStatus;
    private Set<GuestsDto> guests;
}
