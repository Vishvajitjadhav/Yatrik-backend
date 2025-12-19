package com.myprojects.YatrikApp.entity;

import jakarta.persistence.Embeddable;
import lombok.Getter;
import lombok.Setter;

@Getter    // lombok
@Setter    // lombok
@Embeddable  //JPA
public class HotelContactInfo {

    private String address;

    private String location;

    private String email;

    private String PhoneNumber;


}
