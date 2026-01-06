package com.myprojects.YatrikApp.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
//Search function pagination
public class HotelSearchDto {
    private String city;
    private LocalDate startDate;
    private LocalDate endDate;
    private Integer roomsCount;

    private Integer page=0;
    private Integer size=10;

}
