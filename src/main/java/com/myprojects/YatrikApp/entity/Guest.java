package com.myprojects.YatrikApp.entity;

import com.myprojects.YatrikApp.entity.enums.Gender;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Getter
@Setter

public class Guest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    private String name;

    @Enumerated(EnumType.STRING)
    private Gender gender;

    private Integer age;

    @CreationTimestamp
    private LocalDateTime createAt;

//    @ManyToMany(mappedBy = "guests")
//    private Set<Booking> bookings;  not needed

}
