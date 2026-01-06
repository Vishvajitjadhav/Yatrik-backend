package com.myprojects.YatrikApp.dto;

import com.myprojects.YatrikApp.entity.User;
import com.myprojects.YatrikApp.entity.enums.Gender;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Data
public class GuestsDto {
    private long id;
    private User user;
    private String name;
    private Gender gender;
    private Integer age;
    private LocalDateTime createAt;

}
