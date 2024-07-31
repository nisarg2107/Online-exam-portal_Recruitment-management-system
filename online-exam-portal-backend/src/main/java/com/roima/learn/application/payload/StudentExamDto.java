package com.roima.learn.application.payload;

import com.roima.learn.application.payload.simple.SimpleExamDto;
import com.roima.learn.application.payload.simple.SimpleUserDto;
import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Getter
@Setter
public class StudentExamDto {
    private SimpleUserDto user;

    private SimpleExamDto exam;
    private int marks;
    private boolean passed;
    private String ipAddress;
    private String macAddress;
    private boolean submitted;

//    @Enumerated(EnumType.STRING)
    private String status = "pending";
}
