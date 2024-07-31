package com.roima.learn.application.payload.simple;

import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Getter
@Setter
public class SimpleUserDto {
    private int id;
    private String name;
    private String email;
    private String password;
    private boolean active;
}
